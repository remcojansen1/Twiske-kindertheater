        function myFunction(x) {
          x.classList.toggle("change");
        }
		//Hamburger menu
		function hamburgerMenu() {
  		var hamburger = document.getElementById("menu");
  		if (hamburger.style.display === "block") {
    	hamburger.style.display = "none";
  		} else {
    	hamburger.style.display = "block";
  		}	
		}

//Slideshow
		var slideIndex = 1;
          showSlides(slideIndex);

        function plusSlides(n) {
          showSlides(slideIndex += n);
        }

        function currentSlide(n) {
          showSlides(slideIndex = n);
        }

        function showSlides(n) {
          var i;
          var slides = document.getElementsByClassName("mySlides");
          var dots = document.getElementsByClassName("dot");
          if (n > slides.length) {slideIndex = 1}    
          if (n < 1) {slideIndex = slides.length}
          for (i = 0; i < slides.length; i++) {
              slides[i].style.display = "none";  
          }
          for (i = 0; i < dots.length; i++) {
              dots[i].className = dots[i].className.replace(" active", "");
          }
            slides[slideIndex-1].style.display = "block";  
//            dots[slideIndex-1].className += " active";
        }



// OrderForm.js - v0.4


function OrderForm(prefix, precision, firstChoice) {
	
	this.prefix = prefix ? prefix : '';
	
	// ****************************
	// Configure here
	// ****************************
	// names - Set these according to how the html ids are set
	this.FORM_NAME = this.prefix + 'frmOrder';
	this.BTN_TOTAL = this.prefix + 'btnTotal';
	this.TXT_OUT = this.prefix + 'txtTotal';
	
	// partial names - Set these according to how the html ids are set
	this.CHK = this.prefix + 'chk';
	this.SEL = this.prefix + 'sel';
	this.PRICE = this.prefix + 'txtPrice';
	
	// precision for the decimal places
	// If not set, then no decimal adjustment is made
	this.precision = precision ? precision : -1;
	
	// if the drop down has the first choice after index 1
	// this is used when checking or unchecking a checkbox
	this.firstChoice = firstChoice ? firstChoice : 1;
	// ****************************
	
	// form
	this.frm = document.getElementById(this.FORM_NAME);
	
	// checkboxes
	this.chkReg = new RegExp(this.CHK + '([0-9]+)');
	this.getCheck = function(chkId) {
		return document.getElementById(this.CHK + chkId);
	};
	
	// selects
	this.selReg = new RegExp(this.SEL + '([0-9]+)');
	this.getSelect = function(selId) {
		return document.getElementById(this.SEL + selId);
	};
	
	// price spans
	this.priceReg = new RegExp(this.PRICE + '([0-9]+)');
	
	// text output
	this.txtOut = document.getElementById(this.TXT_OUT);
	
	// button
	this.btnTotal = document.getElementById(this.BTN_TOTAL);
	
	// price array
	this.prices = new Array();
	
	var o = this;
	this.getCheckEvent = function() {
		return function() {
			o.checkRetotal(o, this);
		};
	};
	
	this.getSelectEvent = function() {
		return function() {
			o.totalCost(o);
		};
	};
	
	this.getBtnEvent = function() {
		return function() {
			o.totalCost(o);
		};
	};
	
	/*
	 * Calculate the cost
	 * 
	 * Required:
	 *  Span tags around the prices with IDs formatted
	 *  so each item's numbers correspond its select elements and input checkboxes.
	 */
	this.totalCost = function(orderObj) {
		var spanObj = orderObj.frm.getElementsByTagName('span');
		var total = 0.0;
		for (var i=0; i<spanObj.length; i++) {
			var regResult = orderObj.priceReg.exec(spanObj[i].id);
			if (regResult) {
				var itemNum = regResult[1];
				var chkObj = orderObj.getCheck(itemNum);
				var selObj = orderObj.getSelect(itemNum);
				var price = orderObj.prices[itemNum];
				var quantity = 0;
				if (selObj) {
					quantity = parseFloat(selObj.options[selObj.selectedIndex].text);
					quantity = isNaN(quantity) ? 0 : quantity;
					if (chkObj) chkObj.checked = quantity;
				} else if (chkObj) {
					quantity = chkObj.checked ? 1 : 0;
				}
				total += quantity * price;
			}
		}
		if (this.precision == -1) {
			orderObj.txtOut.value = total
		} else {
			orderObj.txtOut.value = total.toFixed(this.precision);
		}
	};

	/*
	 * Handle clicks on the checkboxes
	 *
	 * Required:
	 *  The corresponding select elements and input checkboxes need to be numbered the same
	 *
	 */
	this.checkRetotal = function(orderObj, obj) {
		var regResult = orderObj.chkReg.exec(obj.id);
		if (regResult) {
			var optObj = orderObj.getSelect(regResult[1]);
			if (optObj) {
				if (obj.checked) {
					optObj.selectedIndex = orderObj.firstChoice;
				} else {
					optObj.selectedIndex = 0;
				}
			}
			orderObj.totalCost(orderObj);
		}
	};
	
	/*
	 * Set up events
	 */
	this.setEvents = function(orderObj) {
		var spanObj = orderObj.frm.getElementsByTagName('span');
		for (var i=0; i<spanObj.length; i++) {
			var regResult = orderObj.priceReg.exec(spanObj[i].id);
			if (regResult) {
				var itemNum = regResult[1];
				var chkObj = orderObj.getCheck(itemNum);
				var selObj = orderObj.getSelect(itemNum);
				if (chkObj) {
					chkObj.onclick = orderObj.getCheckEvent();
				}
				if (selObj) {
					selObj.onchange = orderObj.getSelectEvent();
				}
				if (orderObj.btnTotal) {
					orderObj.btnTotal.onclick = orderObj.getBtnEvent();
				}
			}
		}
	};
	this.setEvents(this);

	/*
	 *
	 * Grab the prices from the html
	 * Required:
	 *  Prices should be wrapped in span tags, numbers only.
	 */
	this.grabPrices = function(orderObj) {
		var spanObj = orderObj.frm.getElementsByTagName('span');
		for (var i=0; i<spanObj.length; i++) {
			if (orderObj.priceReg.test(spanObj[i].id)) {
				var regResult = orderObj.priceReg.exec(spanObj[i].id);
				if (regResult) {
					orderObj.prices[regResult[1]] = parseFloat(spanObj[i].innerHTML);
				}
			}
		}
	};
	this.grabPrices(this);
	
}
