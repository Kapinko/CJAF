/*
 * A password scoring plugin for text/password input element.
 * @author Nathan A. Sculli (nathan *at* sculli *dot* me)
 *
 * This plugin is inspired by Jeff Todnem's (http://www.todnem.com/) original
 * work at passwordmeter.com.
 * @see http://www.passwordmeter.com
 *
 * Created on: 2010-08-25
 * Last modified: 2010-08-25
 *
 * License Information
 * -------------------------------------------------------------------------
 * Copyright (C) 2010 Nathan Sculli
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License, or (at your
 *    option) any later version.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 *    General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */
(function($){
	if(typeof window.String.prototype.reverse !== 'function'){
		/**
		 * Add a string reverse function to the String object.
		 * @return {string}
		 */
		var reverse	= function(){
			return this.split('').reverse().join('');
		};
		window.String.prototype.reverse	= reverse;
	}
	/**
	 * @type {string}
	 * @const
	 */
	var ALPHAS		= "abcdefghijklmnopqrstuvwxyz";
	/**
	 * @type {string}
	 * @const
	 */
	var NUMERICS	= "01234567890";
	/**
	 * @type {string}
	 * @const
	 */
	var SYMBOLS		= ")!@#$%^&*()";

	var defaults		= {
		/**
		 * This is the function that will be called when the password score changes.
		 * @type {function(PasswordScore, PasswordScorerInstance)}
		 */
		"scoreUpdate": function(score, inst){return false;},
		/**
		 * This is the default character minimum for a password.
		 * @type {number}
		 */
		'minimumLength':			8,
		/**
		 * This is the minimum characters required for an
		 * alphabetic, lowercase character complexity bonus.
		 * @type {number}
		 */
		"minimumAlphaLC":			1,
		/**
		 * This is the minimum characters required for an
		 * alphabetic, uppercase character complexity bonus.
		 * @type {number}
		 */
		"minimumAlphaUC":			1,
		/**
		 * This is the minimum characters required for an
		 * numeric character complexity bonus.
		 * @type {number}
		 */
		"minimumNumeric":			1,
		/**
		 * This is the minimum characters required for an
		 * symbolic character complexity bonus.
		 * @type {number}
		 */
		"minimumSymbolic":			1,
		/**
		 * This is the minimum complexity score required to
		 * get the complexity bonus.
		 * @type {number}
		 */
		"minimumComplexityScore":	4,
		/**
		 * This is the default bonus point multipler for the
		 * complexity of the password.
		 * @type {number}
		 */
		"complexityBonusMultiplier":	2,
		/**
		 * This is the default bonus point multiplier for the length
		 * of the password
		 * @type {number}
		 */
		"lengthBonusMultiplier":	4,
		/**
		 * This is the default bonus point multiplier for alphabetic characters
		 * @type {number}
		 */
		"alphaBonusMultiplier":		2,
		/**
		 * This is the default bonus point multiplier for numeric characters.
		 * @type {number}
		 */
		"numericBonusMultiplier":	4,
		/**
		 * This is the default bonus point multiplier for symbolic characters.
		 * @type {number}
		 */
		"symbolicBonusMultiplier":	6,
		/**
		 * This is the default bonus point multiplier for the number of symbolic
		 * or numeric characters in the middle of the password.
		 * @type {number}
		 */
		"middleBonusMultiplier":	2,
		/**
		 * This is the default deduction multiplier for having consecutive alphabetic
		 * characters in the password.
		 * @type {number}
		 */
		"consecAlphaDeductionMultiplier":		2,
		/**
		 * This is the default deduction multiplier for having consecutive numeric
		 * characters in the password.
		 * @type {number}
		 */
		"consecNumericDeductionMultiplier":		2,
		/**
		 * This is the default deduction multiplier for having sequential alphabetic
		 * characters in the password.
		 * @type {number}
		 */
		"seqAlphaDeductionMultiplier":			3,
		/**
		 * This is the default deduction multiplier for having sequential numeric
		 * characters in the password.
		 * @type {number}
		 */
		"seqNumericDeductionMultiplier":		3,
		/**
		 * This is the default deduction multiplier for having sequential symbolic
		 * characters in the password.
		 * @type {number}
		 */
		"seqSymbolicDeductionMultiplier":		3
	}
	/**
	 * This is the store object that will be used to calculate the password score
	 * after the parsing object has gone through the password character by
	 * character
	 * @param {Object.<string,*>} options
	 */
	function PasswordScore(options){
		this.options				= $.extend({}, defaults, options);
		/**
		 * The total length of the password.
		 * @type {number}
		 */
		this.length					= 0;
		/**
		 * The total number of alphabetic lowercase characters.
		 * @type {number}
		 */
		this.alphaLC				= 0;
		/**
		 * The total count of alphabetic uppercase characters.
		 * @type {number}
		 */
		this.alphaUC				= 0;
		/**
		 * The total number of consecutive alphabetic uppercase characters.
		 * @type {number}
		 */
		this.consecutiveAlphaUC		= 0;
		/**
		 * The total number of consecutive alphabetic lowercase characters.
		 * @type {number}
		 */
		this.consecutiveAlphaLC		= 0;
		/**
		 * The total number of consecutive numeric characters.
		 * @type {number}
		 */
		this.consecutiveNumeric	= 0;
		/**
		 * The total number of consecutive symbolic characters.
		 * @type {number}
		 */
		this.consecutiveSymbolic	= 0;
		/**
		 * The total count of consecutive characters in the same type group.
		 * (numeric, alphabetic or symbolic)
		 * @type {number}
		 */
		this.consecutiveType		= 0;
		/**
		 * A counter for sequential alphabetic characters.
		 * @type {number}
		 */
		this.sequentialAlpha		= 0;
		/**
		 * A counter for sequential numeric characters.
		 * @type {number}
		 */
		this.sequentialNumeric		= 0;
		/**
		 * A counter for sequential symbol characters.
		 * @type {number}
		 */
		this.sequentialSymbolic		= 0;
		/**
		 * A counter for the total number of sequential characters (of any type).
		 * @type {number}
		 */
		this.sequential				= 0;
		/**
		 * The total count of numeric characters.
		 * @type {number}
		 */
		this.numeric				= 0;
		/**
		 * The total count of symbolic characters
		 * @type {number}
		 */
		this.symbolic				= 0;
		/**
		 * This is the total count of repeat characters.
		 * @type {number}
		 */
		this.repeats				= 0;
		/**
		 * @type {number}
		 */
		this.requirements			= 0;
		/**
		 * The number of points to deduct for repeat characters.
		 * @type {number}
		 */
		this.repeatCharDeduction	= 0;
		/**
		 * The number of points to deduct for the password not having enough
		 * unique characters.
		 * @type {number}
		 */
		this.uniquenessDeduction	= 0;
		/**
		 * The number of symbols or numeric characters in the middle of the
		 * password.
		 * @type {number}
		 */
		this.middleChar				= 0;
		/**
		 * The index of the last alphabetic uppercase character.
		 * @type {number}
		 */
		this.lastAlphaUC			= -1;
		/**
		 * The index of the last alphabetic lowercase character.
		 * @type {number}
		 */
		this.lastAlphaLC			= -1;
		/**
		 * The index of the last numberic character.
		 * @type {number}
		 */
		this.lastNumeric			= -1;
		/**
		 * The index of the last symbolic character.
		 * @type {number}
		 */
		this.lastSymbolic			= -1;
	}
	PasswordScore.prototype	= {
		/**
		 * The length of the password with regard to scoreable characters.
		 * @param {number} length
		 * @return {PasswordScore}
		 */
		"setLength": function(length){
			this.length	= length;
			return this;
		},
		/**
		 * Get the length of the password with regard to scoreable characters.
		 * @return {number}
		 */
		"getLength": function(){
			return this.length;
		},
		/**
		 * Get the number of character duplicates found
		 * @return {number}
		 */
		"getRepeats": function(){
			return this.repeats;
		},
		/**
		 * Get the score for this password.
		 * @return {number}
		 */
		"getScore": function(){
			var bonus		= this.getTotalBonus();
			var deductions	= this.getTotalDeductions();

			var total		= bonus - deductions;

			if(total > 100){
				total	= 100;
			} else if(total < 0){
				total	= 0;
			}
			return total;
		},
		/**
		 * Get the total bonus points for this password score
		 * @return {number}
		 */
		"getTotalBonus": function(){
			var total	= 0;
			
			total	+=	this.getLengthBonus()
					+	this.getAlphaUCBonus()
					+	this.getAlphaLCBonus()
					+	this.getNumericBonus()
					+	this.getSymbolicBonus()
					+	this.getMiddleBonus()
					+	this.getComplexityBonus()
			;
			return total;
		},
		/**
		 * Get the total deductions for this password score.
		 * @return {number}
		 */
		"getTotalDeductions": function(){
			var total	= 0;
			total		+=	this.getAlphaOnlyDeduction()
						+	this.getNumericOnlyDeduction()
						+	this.getRepeatCharacterDeduction()
						+	this.getConsecAlphaLCDeduction()
						+	this.getConsecAlphaUCDeduction()
						+	this.getConsecNumericDeduction()
						+	this.getSeqAlphaDeduction()
						+	this.getSeqNumericDeduction()
						+	this.getSeqSymbolicDeduction()
			;
			return total;
		},
		/**
		 * Get the total number of bonus points for the length of this password.
		 * @return {number}
		 */
		"getLengthBonus": function(){
			var length	= this.getLength(),
				bonus	= 0;

			if(this._isBonusEligible(length, 'length')){
				bonus	= length * this.options['lengthBonusMultiplier'];
			}
			return bonus;
		},
		/**
		 * Get the total number of bonus points for alphabetic uppercase characters
		 * @return {number}
		 */
		"getAlphaUCBonus": function(){
			var bonus	= 0,
				count	= this.alphaUC;
			if(this._isBonusEligible(count, 'alpha')){
				bonus	= parseInt((this.getLength() - count) * this.options['alphaBonusMultiplier']);
			}
			return bonus;
		},
		/**
		 * Get the total number of bonus points for alphabetic lowercase characters.
		 * @return {number}
		 */
		"getAlphaLCBonus": function(){
			var bonus	= 0,
				count	= this.alphaLC;
			if(this._isBonusEligible(count, 'alpha')){
				bonus	= parseInt((this.getLength() - count) * this.options['alphaBonusMultiplier']);
			}
			return bonus;
		},
		/**
		 * Get the total number of bonus points for numeric characters.
		 * @return {number}
		 */
		"getNumericBonus": function(){
			var count		= this.numeric,
				bonus		= 0;

			if(this._isBonusEligible(count, 'numeric')){
				bonus		= parseInt(count * this.options['numericBonusMultiplier'])
			}
			return bonus;
		},
		/**
		 * Get the total number of bonus points for symbolic characters.
		 * @return {number}
		 */
		"getSymbolicBonus": function(){
			var count		= this.symbolic,
				bonus		= 0;

			if(this._isBonusEligible(count, 'symbolic')){
				bonus		= parseInt(count * this.options['symbolicBonusMultiplier'])
			}
			return bonus;
		},
		/**
		 * Get the total number of bonus points for symbolic or numeric characters
		 * in the middle of the password.
		 * @return {number}
		 */
		"getMiddleBonus": function(){
			var count		= this.middleChar,
				bonus		= 0;

			if(this._isBonusEligible(count, 'middle')){
				bonus		= parseInt(count * this.options['middleBonusMultiplier']);
			}
			return bonus;
		},
		/**
		 * Get the complexity score (count)
		 * @return {number}
		 */
		"getComplexity": function(){
			var complexity	= 0;

			if(this.getLength() >= this.options['minimumLength']){
				complexity++;
			}
			if(this.alphaUC >= this.options['minimumAlphaUC']){
				complexity++;
			}
			if(this.alphaLC >= this.options['minimumAlphaLC']){
				complexity++;
			}
			if(this.numeric >= this.options['minimumNumeric']){
				complexity++;
			}
			if(this.symbolic >= this.options['minimumSymbolic']){
				complexity++;
			}
			return complexity;
		},
		/**
		 * Get the complexity bonus
		 * @return {number}
		 */
		"getComplexityBonus": function(){
			var complexity	= this.getComplexity(),
				bonus		= 0;

			if(this._isBonusEligible(complexity, 'complexity')){
				bonus	= complexity * this.options['complexityBonusMultiplier'];
			}
			return bonus;
		},
		/**
		 * Get the point deduction for having only alphabetic characters.
		 * @return {number}
		 */
		"getAlphaOnlyDeduction": function(){
			var deduction	= 0;

			if((this.alphaLC > 0 || this.alphaUC > 0) && this.symbolic < 1 && this.numeric < 1){
				deduction	= this.getLength();
			}
			return deduction;
		},
		/**
		 * Get the point deduction for having only numeric characters.
		 * @return {number}
		 */
		"getNumericOnlyDeduction": function(){
			var deduction	= 0;

			if(this.alphaLC < 1 && this.alphaUC < 1 && this.symbolic < 1 && this.numeric > 0){
				deduction	= this.getLength();
			}
			return deduction;
		},
		/**
		 * Get the point deduction for having repeat characters in the password.
		 * @return {number}
		 */
		"getRepeatCharacterDeduction": function(){
			return this.repeatCharDeduction;
		},
		/**
		 * Get the point deduction for having consecutive alphabetic, uppercase
		 * characters in the password.
		 * @return {number}
		 */
		"getConsecAlphaUCDeduction": function(){
			return this.consecutiveAlphaUC * this.options['consecAlphaDeductionMultiplier'];
		},
		/**
		 * Get the point deduction for having consecutive alphabetic, lowercase
		 * characters in the password.
		 * @return {number}
		 */
		"getConsecAlphaLCDeduction": function(){
			return this.consecutiveAlphaLC * this.options['consecAlphaDeductionMultiplier'];
		},
		/**
		 * Get the point deduction for having consecutive numeric
		 * characters in the password.
		 * @return {number}
		 */
		"getConsecNumericDeduction": function(){
			return this.consecutiveNumeric * this.options['consecNumericDeductionMultiplier'];
		},
		/**
		 * Get the point deduction for having sequential alphabetic characters
		 * in the password.
		 * @return {number}
		 */
		"getSeqAlphaDeduction": function(){
			return this.sequentialAlpha * this.options['seqAlphaDeductionMultiplier'];
		},
		/**
		 * Get the point deduction for having sequential numeric characters
		 * in the password.
		 * @return {number}
		 */
		"getSeqNumericDeduction": function(){
			return this.sequentialNumeric * this.options['seqNumericDeductionMultiplier'];
		},
		/**
		 * Get the point deduction for having sequential symbolic characters
		 * in the password.
		 * @return {number}
		 */
		"getSeqSymbolicDeduction": function(){
			return this.sequentialSymbolic * this.options['seqSymbolicDeductionMultiplier'];
		},
		/**
		 * Notification that the user found an alphabetic uppwercase character
		 * at the given index in the password we're scoring.
		 * @param {number} index
		 * @return {PasswordScore}
		 */
		"gotAlphaUC": function(index){
			if(this._isConsecutive(index, this.lastAlphaUC)){
				this.consecutiveAlphaUC++;
			}
			this.lastAlphaUC = index;
			this.alphaUC++;
			return this;
		},
		/**
		 * Notification that the user found an alphabetic lowercase character
		 * at the given index in the password we're scoring.
		 * @param {number} index
		 * @return {PasswordScore}
		 */
		"gotAlphaLC": function(index){
			if(this._isConsecutive(index, this.lastAlphaLC)){
				this.consecutiveAlphaLC++;
			}
			this.lastAlphaLC	= index;
			this.alphaLC++;
			return this;
		},
		/**
		 * Notification that the user found an numeric character
		 * at the given index in the password we're scoring.
		 * @param {number} index
		 * @return {PasswordScore}
		 */
		"gotNumeric": function(index){
			if(this._isConsecutive(index, this.lastNumeric)){
				this.consecutiveNumeric++;
			}
			this.lastNumeric	= index;
			this.numeric++;
			return this;
		},
		/**
		 * Notification that the user found an symbolic character
		 * at the given index in the password we're scoring.
		 * @param {number} index
		 * @return {PasswordScore}
		 */
		"gotSymbolic": function(index){
			if(this._isConsecutive(index, this.lastSymbolic)){
				this.consecutiveSymbolic++;
			}
			this.lastSymbolic	= index;
			this.symbolic++;
			return this;
		},
		/**
		 * Notification that the user found a symbolic or numeric character
		 * in the middle of the password.
		 * @param {number} index
		 * @return {PasswordScore}
		 */
		"gotMiddleChar": function(index){
			this.middleChar++;
			return this;
		},
		/**
		 * Notification that the user founds a repeating character
		 * @param {number} index
		 * @param {number} repeatIndexList
		 * @return {PasswordScore}
		 */
		"gotRepeat": function(index, repeatIndexList){
			var repeatDeduction	= this.repeatCharDeduction,
				length			= this.getLength();

			for(var i = 0; i < repeatIndexList.length; i++){
				/*
					Calculate icrement deduction based on proximity to identical characters
					Deduction is incremented each time a new match is discovered
					Deduction amount is based on total password length divided by the
					difference of distance between currently selected match
				*/
			   repeatDeduction += Math.abs(length / (repeatIndexList[i] - index));
			}
			this.repeats++;
			this.uniquenessDeduction = length - this.repeats;
			this.repeatCharDeduction = (this.uniquenessDeduction) ? Math.ceil(repeatDeduction/this.uniquenessDeduction) : Math.ceil(repeatDeduction);
			return this;
		},
		/**
		 * Notification that the user found a sequential alphabetic character.
		 * @return {PasswordScore}
		 */
		"gotSequentialAlpha": function(){
			this.sequentialAlpha++;
			this.sequential++;
			return this;
		},
		/**
		 * Notification that the user found a sequential numeric character.
		 * @return {PasswordScore}
		 */
		"gotSequentialNumeric": function(){
			this.sequentialNumeric++;
			this.sequential++;
			return this;
		},
		/**
		 * Notification that the user found a sequential symbolic character
		 * @return {PasswordScore}
		 */
		"gotSequentialSymbolic": function(){
			this.sequentialSymbolic++;
			this.sequential++;
			return this;
		},
		/**
		 * Does the given index and last index represent a consecutive occurance?
		 * @param {number} currentIndex
		 * @param {number} lastIndex
		 * @return {boolean}
		 */
		_isConsecutive: function(currentIndex, lastIndex){
			var is_consecutive	= (lastIndex > -1 && (lastIndex + 1) == currentIndex) ? true : false;

			this.consecutiveType++;

			return is_consecutive;
		},
		/**
		 * Is the given count of characters eligible for a bonus?
		 * @param {number} count
		 * @param {string} type
		 * @return {boolean}
		 */
		_isBonusEligible: function(count, type){
			var is_eligible	= false;

			switch(type){
				case 'alpha':
				case 'numeric':
					is_eligible	= (count > 0 && count < this.getLength());
					break;

				case 'length':
					is_eligible	= true;
					break;
					
				case 'symbolic':
				case 'middle':
					is_eligible	= (count > 0);
					break;

				case 'complexity':
					var minimum_score	= this.options['minimumComplexityScore'];
					if(this.getLength() >= this.options['minimumLength']){
						minimum_score--;
					}
					is_eligible	= (count > minimum_score) ? true : false;
					break;
			}
			return is_eligible
		}
	};
	/**
	 * This is the instance object that will handle the scoring of the given password.
	 * @param {Object.<string, *>} options
	 */
	function PasswordScorer(options){
		/**
		 * @type {PasswordScore}
		 */
		this._score	= null;
	}
	$.extend(PasswordScorer.prototype, {
		/**
		 * Check the given password.
		 */
		"score": function(password){
			this._score	= new PasswordScore();
			this._score.setLength(password.length);
			
			this._checkForConsecutiveCharacterPatterns(password);
			this._checkForAlphaStringPatterns(password);
			this._checkForNumericStringPatterns(password);
			this._checkForSymbolicStringPatterns(password);

			return this._score;
		},
		/**
		 * Loop through the password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches
		 * @param {string} password
		 */
		_checkForConsecutiveCharacterPatterns: function(password){
			var passAsArray		= password.replace(/\s+/g,"").split(/\s*/);

			for(var index = 0; index < passAsArray.length; index++){
				var current	= passAsArray[index];

				if(current.match(/[A-Z]/g)){
					this._score.gotAlphaUC(index);

				} else if(current.match(/[a-z]/g)){
					this._score.gotAlphaLC(index);

				} else if(current.match(/[0-9]/g)){
					if(index > 0 && index < (passAsArray.length - 1)){
						this._score.gotMiddleChar(index);
					}
					this._score.gotNumeric(index);

				} else if(current.match(/[^a-zA-Z0-9_]/g)){
					if(index > 0 && index < (passAsArray.length - 1)){
						this._score.gotMiddleChar(index);
					}
					this._score.gotSymbolic(index);
				}

				this._checkForDuplicateCharacter(passAsArray, current, index);
			}
		},
		/**
		 * Check to see if the given character appears anywhere else in the password.
		 * @param {Array.<string>} passwordAsArray
		 * @param {string} character
		 * @param {number} characterIndex
		 */
		_checkForDuplicateCharacter: function(passwordAsArray, character, characterIndex){
			var dupFound	= false,
				indexList	= new Array();

			for(var index = 0; index < passwordAsArray.length; index++){
				var dupCheck	= passwordAsArray[index];

				if(dupCheck == character && index != characterIndex){
					dupFound	= true;
					indexList.push(index);
				}
			}

			if(dupFound){
				this._score.gotRepeat(characterIndex, indexList);
			}
		},
		/**
		 * Check the password for sequentical alphabetic patterns.
		 * (forward and reverse).
		 * @param {string} password
		 */
		_checkForAlphaStringPatterns: function(password){
			var boundry	= ALPHAS.length - 3;

			for(var i = 0; i < boundry; i++){
				var pattern = ALPHAS.substring(i, parseInt(i + 3));
				if(this._hasPattern(pattern, password)){
					this._score.gotSequentialAlpha();
				}
			}
		},
		/**
		 * Check the password for sequential numeric patterns (forward and reverse).
		 * @param {string} password
		 */
		_checkForNumericStringPatterns: function(password){
			var boundry	= NUMERICS.length - 3;
			for(var i = 0; i < boundry; i++){
				var pattern	= NUMERICS.substring(i, parseInt(i + 3));
				if(this._hasPattern(pattern, password)){
					this._score.gotSequentialNumeric();
				}
			}
		},
		/**
		 * Check the password for sequential symbolic patterns (forward and reverse).
		 * @param {string} password
		 */
		_checkForSymbolicStringPatterns: function(password){
			var boundry	= SYMBOLS.length - 3;
			for(var i = 0; i < boundry; i++){
				var pattern	= SYMBOLS.substring(i, parseInt(i + 3));
				if(this._hasPattern(pattern, password)){
					this._score.gotSequentialSymbolic();
				}
			}
		},
		/**
		 * Does the given password contain the given pattern? (forward and reverse);
		 * @param {string} pattern
		 * @param {string} password
		 * @return {boolean}
		 */
		_hasPattern: function(pattern, password){
			password		= password.toLowerCase();
			var has_pattern	= false;

			if(password.indexOf(pattern) != -1
			|| password.indexOf(pattern.reverse()) != -1
			){
				has_pattern	= true;
			}
			return has_pattern;
		}
	});
	/**
	 * This is the jQuery data property name where our plugin instances
	 * will be stored.
	 * @type {string}
	 */
	var PROP_NAME		= 'PasswordScore';
	/**
	 * This is the event that will be triggered when the score is updated.
	 * @type {string}
	 */
	var EVENT_UPDATED	= "updated.PasswordScore";

	/**
	 * This is the intstance object that will handle the scoring of the
	 * user input in the attached element.
	 * @type {string} id
	 * @type {jQuery} target
	 * @type {Object} options
	 */
	function PasswordScoreInstance(id, target, options){
		/**
		 * this is the configuration object.
		 * @type {Object}
		 */
		this.config	= $.extend({}, defaults, options);
		/**
		 * This is the element we are responsible for.
		 * @type {jQuery}
		 */
		this.element	= target;
		/**
		 * This is our target element's identifier.
		 * @type {string}
		 */
		this.elementId	= id;

		/**
		 * This is our internal scorer instance.
		 * @type {PasswordScorer}
		 */
		this.scorer		= new PasswordScorer(options);

		this._create();
	}
	$.extend(PasswordScoreInstance.prototype, {
		/**
		 * Initialize this Password Scorer Instance
		 */
		_create: function(){
			this.element.unbind().keyup($.proxy(this, "_handleKeyUp"));
		},
		/**
		 * Get the password score
		 * @return {PasswordScore}
		 */
		score: function(){
			var password	= this.element.val();
			return this.scorer.score(password);
		},
		/**
		 * Handle the user entering data into the field.
		 */
		_handleKeyUp: function(event){
			//update score
			var score	= this.score();

			//fire updated event.
			this.element.trigger(EVENT_UPDATED, [score]);

			//call update handler
			this.config['scoreUpdate'](score, this);
		}
	});
	/**
	 * This is the object that will handle an attaching the instance to an element.
	 * This is the public interface.
	 */
	function PasswordScorePlugin(){
		/**
		 * @type {Object}
		 */
		this._defaults	= defaults;
	}
	$.extend(PasswordScorePlugin.prototype, {
		/**
		 * Get the current password score as an integer.
		 * @param {element} target
		 * @return {number}
		 */
		"_getScorePasswordScore": function(target){
			var inst	= this._getInstance(target);
			var score	= inst.score();

			return score.getScore();
		},
		/**
		 * Get the current password score as a PasswordScore object.
		 * @param {element} target
		 * @return {number}
		 */
		"_getObjectPasswordScore": function(target){
			var inst	= this._getInstance(target);
			return inst.score();
		},
		/**
		 * Attach the scorer instance to the given element.
		 *
		 * @param {element} target - the target document element
		 * @param {Object} settings - the user requested settings to use for this instance.
		 */
		_attachInstance: function(target, settings){
			settings	= $.extend({}, this._defaults, settings);
			var inst	= this._newInstance($(target), settings);

			$.data(target, PROP_NAME, inst);
		},
		/**
		 * Create a new scorer instance for the given target element.
		 * @param {jQuery} target
		 * @param {Object} settings
		 * @return {PasswordScorerInstance}
		 */
		_newInstance: function(target, settings){
			var id		= target[0].id.replace(/([:\[\]\.])/g, '\\\\$1'); // escape jQuery meta chars
			var inst	= new PasswordScoreInstance(id, target, settings);
			return inst;
		},
		/**
		 * Get the scorer instance for the given target element.
		 * @param {element} target
		 * @return {PasswordScorerInstance}
		 * @throws {error} if we cannot find the instance data.
		 */
		_getInstance: function(target){
			try {
				return $.data(target, PROP_NAME);
			} catch(err){
				throw "Missing instance data for this Password Scorer";
			}
		}
	});
	//Now finally let's add our jQuery plugin
	/**
	 * @param {Object.<string, *>}
	 */
	$.fn.passwordScore	= function(options){
		if(!$.passwordScore.initialized){
			$.passwordScore.initialized	= true;
		}
		var otherArgs	= Array.prototype.slice.call(arguments, 0),
			score		= this;

		this.each(function(){
			typeof options	=== 'string' ?
				score	= $.passwordScore['_'+options+'PasswordScore'].apply($.passwordScore, [this].concat(otherArgs)) :
				$.passwordScore._attachInstance(this, options);
		});
		return score;
	}
	//Standard jQuery extension properties.
	$.passwordScore				= new PasswordScorePlugin();
	$.passwordScore.intialized	= false;
	$.passwordScore.uuid		= new Date().getTime();
	$.passwordScore.version		= '0.1';

	/*
	 * Add the password score object to the jQuery namespace.
	 * @type {PasswordScore}
	 */
	$.passwordScore.Score	= PasswordScore;
	/**
	 * Add a static scoring function
	 * @type {function(string, Object.<string, *>): $.passwordScore.Score}
	 *
	 */
	$.passwordScore.score	= function(password, options){
		var scorer	= new PasswordScorer(options);
		return scorer.score(password);
	};
	/**
	 * This is the event that will be triggered when the score is updated.
	 * @type {string}
	 */
	$.passwordScore.event	= {
		'updated': EVENT_UPDATED
	};

})(jQuery);