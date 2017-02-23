function STC(TL) {
	var referenceContours; // the actual STC Curves
	if (TL[0].length == 6){
		referenceContours = [-16, -7, 0, 3, 4, 4]; // octave band contours (input from 124Hz to 4000Hz)
	}else{
		referenceContours = [-16, -13, -10, -7, -4, -1, 0, 1, 2, 3, 4, 4, 4, 4, 4, 4]; // third octave band contours (input from 124Hz to 4000Hz)
	}
	var trialContour = 0; // start checking at STC-0
	var passing = true;
	var deficiencies = [];
	while(passing){
		for(var i = 0; i < referenceContours.length; i++){
			//the deficiency at each band is the difference between the measured transmission loss and the reference contour
			deficiencies[i] = TL[0][i] - (trialContour + referenceContours[i]);
		}
		deficiencies = deficiencies.map(function(x) {if(x<0){return -1*x;}else{return 0;}}); // ignore values above the reference contour, and make those below positive

		//check if our transmission loss values satisfy the current trial contour
		if(checkDeficiencies(deficiencies)){
			// we passed, check the next contour
			trialContour++;
		}else{
			// we failed, the last one was the highest STC value our transmission loss values satisfy
			passing = false;
			trialContour--;
		}
	}
	return trialContour;
}

function checkDeficiencies(deficiencies){
	return 	deficiencies.reduce(function(a, b) {return a + b;}) <= 32 && // the sum of the deficiencies cannot be more than 32
			deficiencies.every(function(c) {return c <= 8;}); // no individual band can have more than 8 deficiencies
}
