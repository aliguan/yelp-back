

// GA.js

var BUDGETMAX = 100;
var BUDGETMIN = 85;

var allData = {
  Event1: [{ name: "golf", cost: 10, rating: 1 },
  { name: "swimming", cost: 5, rating: 1 },
  { name: "jogging", cost: 0, rating: 10 },
  { name: "stroll", cost: 0, rating: 1 },
  { name: "laughing", cost: 0, rating: 1 },
  { name: "none", cost: 0, rating: 1 }],
  Breakfast: [{ name: "Tiffany's", cost: 10, rating: 4.4 },
  { name: "McDonalds", cost: 5, rating: 3.5 },
  { name: "BK", cost: 5, rating: 30.3 },
  { name: "iHop", cost: 8, rating: 3.9 },
  { name: "KeKes", cost: 12, rating: 4.1 },
  { name: "none", cost: 0, rating: 0 }],
  Event2: [{ name: "Movie", cost: 12, rating: 1 },
  { name: "Park", cost: 0, rating: 1 },
  { name: "Zoo", cost: 35, rating: 1 },
  { name: "Gym", cost: 10, rating: 1 },
  { name: "Art walk", cost: 0, rating: 1 },
  { name: "none", cost: 0, rating: 1 }],
  Lunch: [{ name: "MD", cost: 7, rating: 3.3 },
  { name: "Chiptole", cost: 9, rating: 4.0 },
  { name: "Taco Bell", cost: 7, rating: 3.5 },
  { name: "Cafe", cost: 14, rating: 4.1 },
  { name: "Subway", cost: 7, rating: 3.8 },
  { name: "none", cost: 0, rating: 0 }],
  Event3: [{ name: "Hang Out", cost: 1, rating: 1 },
  { name: "Walk", cost: 1, rating: 1 },
  { name: "Netflix", cost: 10, rating: 1 },
  { name: "Hike", cost: 5, rating: 1 },
  { name: "Sailing", cost: 18, rating: 2 },
  { name: "none", cost: 0, rating: 1 }],
  Dinner: [{ name: "Fancy1", cost: 18, rating: 4.3 },
  { name: "Fancy2", cost: 20, rating: 4.4 },
  { name: "Fancy3", cost: 15, rating: 4.2 },
  { name: "Fancy4", cost: 25, rating: 4.0 },
  { name: "Fancy5", cost: 35, rating: 4.9 },
  { name: "none", cost: 0, rating: 1 }],
  Event4: [{ name: "Dancing", cost: 5, rating: 1 },
  { name: "Bar", cost: 25, rating: 20 },
  { name: "Club", cost: 30, rating: 2.1 },
  { name: "Painting", cost: 23, rating: 1.9 },
  { name: "Gallery", cost: 10, rating: 1 },
  { name: "none", cost: 0, rating: 1 }],
};



function preProcessData(allData_in) {
  var parsedDataObj = {
    numItemsArrayOut: [0, 0, 0, 0, 0, 0, 0],
    Event1Cost: [0],
    Event1Rating: [0],
    BreakfastCost: [0],
    BreakfastRating: [0],
    Event2Cost: [0],
    Event2Rating: [0],
    LunchCost: [0],
    LunchRating: [0],
    Event3Cost: [0],
    Event3Rating: [0],
    DinnerCost: [0],
    DinnerRating: [0],
    Event4Cost: [0],
    Event4Rating: [0]
  };
  try {
    var numEvent1 = allData_in.Event1.length;
    var event1Costs = new Array(numEvent1);
    var event1Ratings = new Array(numEvent1);
    event1Costs = allData_in.Event1.map(a => a.cost);
    event1Ratings = allData_in.Event1.map(a => a.rating);
    
    var numBreakfast = allData_in.Breakfast.length;
    var breakfastCosts = new Array(numBreakfast);
    var breakfastRatings = new Array(numBreakfast);
    breakfastCosts = allData_in.Breakfast.map(a => a.cost);
    breakfastRatings = allData_in.Breakfast.map(a => a.rating);

    var numEvent2 = allData_in.Event2.length;
    var event2Costs = new Array(numEvent2);
    var event2Ratings = new Array(numEvent2);
    event2Costs = allData_in.Event2.map(a => a.cost);
    event2Ratings = allData_in.Event2.map(a => a.rating);

    var numLunch = allData_in.Lunch.length;
    var lunchCosts = new Array(numLunch);
    var lunchRatings = new Array(numLunch);
    lunchCosts = allData_in.Lunch.map(a => a.cost);
    lunchRatings = allData_in.Lunch.map(a => a.rating);

    var numEvent3 = allData_in.Event3.length;
    var event3Costs = new Array(numEvent3);
    var event3Ratings = new Array(numEvent3);
    event3Costs = allData_in.Event3.map(a => a.cost);
    event3Ratings = allData_in.Event3.map(a => a.rating);

    var numDinner = allData_in.Dinner.length;
    var dinnerCosts = new Array(numDinner);
    var dinnerRatings = new Array(numDinner);
    dinnerCosts = allData_in.Dinner.map(a => a.cost);
    dinnerRatings = allData_in.Dinner.map(a => a.rating);

    var numEvent4 = allData_in.Event4.length;
    var event4Costs = new Array(numEvent4);
    var event4Ratings = new Array(numEvent4);
    event4Costs = allData_in.Event4.map(a => a.cost);
    event4Ratings = allData_in.Event4.map(a => a.rating);

    parsedDataObj = {
      numItemsArrayOut: [numEvent1, numBreakfast, numEvent2, numLunch, numEvent3, numDinner, numEvent4],
      Event1Cost: event1Costs,
      Event1Rating: event1Ratings,
      BreakfastCost: breakfastCosts,
      BreakfastRating: breakfastRatings,
      Event2Cost: event2Costs,
      Event2Rating: event2Ratings,
      LunchCost: lunchCosts,
      LunchRating: lunchRatings,
      Event3Cost: event3Costs,
      Event3Rating: event3Ratings,
      DinnerCost: dinnerCosts,
      DinnerRating: dinnerRatings,
      Event4Cost: event4Costs,
      Event4Rating: event4Ratings
    }
    return parsedDataObj;
  }
   catch (err) {
     //error message here
    return 0;
   }

}


// categories: breakfast, lunch, dinner, event
function doGA() {

  // Format data
  var parsedDataAll = preProcessData(allData);  
  if (parsedDataAll == 0) return 0;

  // Initialize constants for GA
  var maxIter = 20;                               // max iterations
  var itinerarySize = 7;                          // number of things to do in the day
  var elitek = 1;                                 // number of elite iteneraries passed onto the next generation
  var popSize = 10 + elitek;                      // population size for each generation
  var crossRate = 50;                             // crossover rate
  var mutateRate = 85;                            // mutation rate
  var numItemsArray = new Array(itinerarySize);
  numItemsArray = parsedDataAll.numItemsArrayOut.slice();
  var tempItinerary = new Array(itinerarySize);
  var childItinerary = new Array(itinerarySize);
  var crossedItineraryArray;
  var itineraryPopulation = new Array(popSize);   // population array (array of arrays)
  var newItineraryPop = new Array(popSize);
  var allItineraryRatings = new Array(popSize);
  var allItineraryRatingsSum = 0;
  var irand;
  var bestItinerary = new Array(itinerarySize);
  var iBestItinerary;
  var bestItineraryObj;
  var bestRating;
  var bestCost;

  // Create first population to initialize GA
  itineraryPopulation = initializePopulation(popSize, itinerarySize, numItemsArray);
  console.log(itineraryPopulation);

  // Find the "fittest" itinerary and return some itinerary stats
  bestItineraryObj = findBestItinerary(itineraryPopulation, parsedDataAll);
  iBestItinerary = bestItineraryObj.bestItineraryOut;
  bestRating = bestItineraryObj.bestItineraryRatingOut;
  bestCost = bestItineraryObj.bestItineraryCostOut;
  allItineraryRatings = bestItineraryObj.allItineraryRatingsOut;
  allItineraryRatingsSum = bestItineraryObj.allItineraryValSumOut;

  for (var i = 0; i < maxIter; i++) {
    // Construct new population of itineraries
    popCnt = 0;

    // Populate with the elite itineraries first
    for (var j = 0; j < elitek; j++) {
      newItineraryPop[j] = [iBestItinerary[0],
      iBestItinerary[1],
      iBestItinerary[2],
      iBestItinerary[3],
      iBestItinerary[4],
      iBestItinerary[5],
      iBestItinerary[6]];
      popCnt = popCnt + 1;
    }

    // Breed/select other itineraries
    while (popCnt < popSize) {

      // Pick two itineraries
      var iItineraryPick1 = 0;
      var iItineraryPick2 = 0;

      // Use roulette selection or randomized
      var pick = randomIntFromInterval(1, 2);
      if (pick == 1) {
        iItineraryPick1 = rouletteSelect(allItineraryRatings, allItineraryRatingsSum);
        iItineraryPick2 = rouletteSelect(allItineraryRatings, allItineraryRatingsSum);
      }
      else {
        iItineraryPick1 = randomIntFromInterval(0, popSize - 1);
        iItineraryPick2 = pickRandomItineraryItemExcluding(popSize, iItineraryPick1);
      }

      var tempItinerary1 = itineraryPopulation[iItineraryPick1];
      var tempItinerary2 = itineraryPopulation[iItineraryPick2];

      // Crossover the two itineraries if randomly chosen to do so
      irand = randomIntFromInterval(1, 100);
      if (irand < crossRate) {
        crossedItineraryArray = crossover(tempItinerary1, tempItinerary2);
        tempItinerary1 = [crossedItineraryArray[0][0], crossedItineraryArray[0][1], crossedItineraryArray[0][2], crossedItineraryArray[0][3],
        crossedItineraryArray[0][4], crossedItineraryArray[0][5], crossedItineraryArray[0][6]];
        tempItinerary2 = [crossedItineraryArray[1][0], crossedItineraryArray[1][1], crossedItineraryArray[1][2], crossedItineraryArray[1][3],
        crossedItineraryArray[1][4], crossedItineraryArray[1][5], crossedItineraryArray[1][6]];
      }

      // Mutate the two itineraries if randomly chosen to do so
      irand = randomIntFromInterval(1, 100);
      if (irand < mutateRate) {
        tempItinerary1 = mutate(tempItinerary1, numItemsArray);
      }

      irand = randomIntFromInterval(1, 100);
      if (irand < mutateRate) {
        tempItinerary2 = mutate(tempItinerary2, numItemsArray);
      }

      // Append newly bred itineraries to current population
      newItineraryPop[popCnt] = [tempItinerary1[0], tempItinerary1[1], tempItinerary1[2], tempItinerary1[3],
      tempItinerary1[4], tempItinerary1[5], tempItinerary1[6]];
      newItineraryPop[popCnt + 1] = [tempItinerary2[0], tempItinerary2[1], tempItinerary2[2], tempItinerary2[3],
      tempItinerary2[4], tempItinerary2[5], tempItinerary2[6]];
      popCnt = popCnt + 2;
    } // end while loop



    itineraryPopulation = newItineraryPop.slice(0);
    bestItineraryObj = findBestItinerary(itineraryPopulation, parsedDataAll);
    iBestItinerary = bestItineraryObj.bestItineraryOut;
    bestRating = bestItineraryObj.bestItineraryRatingOut;
    console.log("best rating at " + i + "th iteration: " + bestRating);
    console.log("best cost at " + i + "th iteration: " + bestCost);
    bestCost = bestItineraryObj.bestItineraryCostOut;
    allItineraryRatings = bestItineraryObj.allItineraryRatingsOut;
    allItineraryRatingsSum = bestItineraryObj.allItineraryValSumOut;
    //console.log(allItineraryRatings)

  } // end maxIter loop


  console.log(iBestItinerary);
  console.log("best rating: " + bestRating);
  console.log("best cost: " + bestCost);
  console.log()
  console.log(iBestItinerary[0]);
  bestItinerary[0] = allData.Event1[iBestItinerary[0]].name;
  bestItinerary[1] = allData.Breakfast[iBestItinerary[1]].name;
  bestItinerary[2] = allData.Event2[iBestItinerary[2]].name;
  bestItinerary[3] = allData.Lunch[iBestItinerary[3]].name;
  bestItinerary[4] = allData.Event3[iBestItinerary[4]].name;
  bestItinerary[5] = allData.Dinner[iBestItinerary[5]].name;
  bestItinerary[6] = allData.Event4[iBestItinerary[6]].name;

  console.log(bestItinerary);
}

// Generate a random number from min to max inclusive
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Initialize population (step one of GA)
function initializePopulation(popSize_in, itinerarySize_in, numItemsArray_in) {
  // Initialization
  var itineraryPop = new Array(popSize_in);
  var itinerary = new Array(itinerarySize_in);

  for (var i = 0; i < popSize_in; i++) {
    // Randomly pick an itinerary item from each category
    iEvent1 = randomIntFromInterval(0, numItemsArray_in[0] - 1);
    iBreakfast = randomIntFromInterval(0, numItemsArray_in[1] - 1);
    iEvent2 = randomIntFromInterval(0, numItemsArray_in[2] - 1);
    iLunch = randomIntFromInterval(0, numItemsArray_in[3] - 1);
    iEvent3 = randomIntFromInterval(0, numItemsArray_in[4] - 1);
    iDinner = randomIntFromInterval(0, numItemsArray_in[5] - 1);
    iEvent4 = randomIntFromInterval(0, numItemsArray_in[6] - 1);

    // Create the randomized itineraries and generate the population of itineraries
    itinerary = [iEvent1, iBreakfast, iEvent2, iLunch, iEvent3, iDinner, iEvent4];
    itineraryPop[i] = itinerary;
  }
  return itineraryPop;
}

// Pick a random index and have the ability to exclude ONE index in an array of length numCategoryItems
function pickRandomItineraryItemExcluding(numCategoryItems, iExcludeItem) { // Note numCategoryItems is the length of the vector
  // iExcludeItem is the INDEX of the vector
  iItineraryItem = randomIntFromInterval(0, numCategoryItems - 1); // from 0 to length of array minus 1
  if (iItineraryItem == iExcludeItem) {
    if (iItineraryItem == 0) {
      iItineraryItem++;
    }
    else if (iItineraryItem == (numCategoryItems - 1)) {
      iItineraryItem--;
    }
    else {
      iItineraryItem++;
    }
  }
  return iItineraryItem;
}

// Check if value is present in array
function isInArray(value, array) {
  var valueStr = value.toString();
  var arrayStr = array.toString();
  return arrayStr.indexOf(valueStr) > -1;
}

// Determine the "fittest" itinerary
function findBestItinerary(itineraryPop_in, allData_in) {
  var budgetmax = BUDGETMAX;
  var budgetmin = BUDGETMIN;
  var maxItineraryRating = 0;
  var itineraryRating = 0;
  var popLen = itineraryPop_in.length;
  var maxItineraryCost = 0;
  var itineraryCost = 0;
  var bestItinerary;
  var allItineraryRatings = new Array(popLen);
  var allItineraryValSum = 0;
  for (var i = 0; i < popLen; i++) {

    // Get the cost of eah itinerary
    itineraryCost = getTotalCost(itineraryPop_in[i], allData_in);
    itineraryCost = Math.round(itineraryCost);

    // Set the rating of the itinerary to zero if it exceeds the budget
    if (itineraryCost > budgetmax) {
      itineraryRating = 0;
    }
    else if (itineraryCost < budgetmin) {
      itineraryRating = 0;
    }
    // Otherwise, calculate the total rating of the itinerary
    else {
      itineraryRating = getTotalRating(itineraryPop_in[i], allData_in);
    }

    // Save all the total ratings for later use
    allItineraryRatings[i] = itineraryRating;

    // Save the entire population's total rating
    allItineraryValSum = allItineraryValSum + itineraryRating;

    // Find max rated itinerary
    if (itineraryRating > maxItineraryRating) {
      maxItineraryRating = itineraryRating;
      maxItineraryCost = itineraryCost;
      bestItinerary = itineraryPop_in[i];
    }
  }

  // Garbage collection
  if (maxItineraryRating == 0) {
    bestItinerary = itineraryPop_in[0];
  }

  // Return results 
  return {
    bestItineraryOut: // array of indices
      [bestItinerary[0],
      bestItinerary[1],
      bestItinerary[2],
      bestItinerary[3],
      bestItinerary[4],
      bestItinerary[5],
      bestItinerary[6]],
    bestItineraryRatingOut: maxItineraryRating,
    bestItineraryCostOut: maxItineraryCost,
    allItineraryRatingsOut: allItineraryRatings,
    allItineraryValSumOut: allItineraryValSum
  };
}


function getTotalCost(itinerary_in, allData_in) {
  var totalCost = 0;
  var itineraryItemCost = 0;
  var len = itinerary_in.length;

  for (var i = 0; i < len; i++) {
    if (i == 0) {
      itineraryItemCost = allData_in.Event1Cost[itinerary_in[i]];
    }
    else if (i == 1) {
      itineraryItemCost = allData_in.BreakfastCost[itinerary_in[i]];
    }
    else if (i == 2) {
      itineraryItemCost = allData_in.Event2Cost[itinerary_in[i]];
    }
    else if (i == 3) {
      itineraryItemCost = allData_in.LunchCost[itinerary_in[i]];
    }
    else if (i == 4) {
      itineraryItemCost = allData_in.Event3Cost[itinerary_in[i]];
    }
    else if (i == 5) {
      itineraryItemCost = allData_in.DinnerCost[itinerary_in[i]];
    }
    else {
      itineraryItemCost = allData_in.Event4Cost[itinerary_in[i]];
    }
    totalCost = totalCost + itineraryItemCost;
  }
  return totalCost;
}

function getTotalRating(itinerary_in, allData_in) {
  var totalRating = 0;
  var itineraryItemRating = 0;
  var len = itinerary_in.length;

  for (var i = 0; i < len; i++) {
    if (i == 0) {
      itineraryItemRating = allData_in.Event1Rating[itinerary_in[i]];
    }
    else if (i == 1) {
      itineraryItemRating = allData_in.BreakfastRating[itinerary_in[i]];
    }
    else if (i == 2) {
      itineraryItemRating = allData_in.Event2Rating[itinerary_in[i]];
    }
    else if (i == 3) {
      itineraryItemRating = allData_in.LunchRating[itinerary_in[i]];
    }
    else if (i == 4) {
      itineraryItemRating = allData_in.Event3Rating[itinerary_in[i]];
    }
    else if (i == 5) {
      itineraryItemRating = allData_in.DinnerRating[itinerary_in[i]];
    }
    else {
      itineraryItemRating = allData_in.Event4Rating[itinerary_in[i]];
    }
    totalRating = totalRating + itineraryItemRating;
  }
  totalRating = Math.round(totalRating);
  return totalRating;
}

// Roulette selection function: higher probability to select the "more fit" itineraries
function rouletteSelect(allItineraryRatings_in, allItineraryRatingsSum_in) {
  var popLen = allItineraryRatings_in.length;
  var value = Math.random() * allItineraryRatingsSum_in;
  var iRet = randomIntFromInterval(0, popLen - 1);
  for (var i = 0; i < popLen; i++) {
    value = value - allItineraryRatings_in[i];
    if (value <= 0) {
      iRet = i;
      break;
    }
  }
  return iRet;
}

// Crossover two itinerary items so that they swap characteristics 
function crossover(itinerary1_in, itinerary2_in) {
  var irand = randomIntFromInterval(1, 4); //random number between 1 and 4 inclusive
  var itinerary1Org = itinerary1_in.slice(0);
  var itinerary2Org = itinerary2_in.slice(0);

  // Randomly select a set of items to swap 
  if (irand == 1) {
    // Swap early items
    itinerary1_in[0] = itinerary2_in[0];
    itinerary1_in[1] = itinerary2_in[1];
    itinerary2_in[0] = itinerary1Org[0];
    itinerary2_in[1] = itinerary1Org[1];
  }
  else if (irand == 2) {
    // Swap afternoon items
    itinerary1_in[2] = itinerary2_in[2];
    itinerary1_in[3] = itinerary2_in[3];
    itinerary2_in[2] = itinerary1Org[2];
    itinerary2_in[3] = itinerary1Org[3];
  }
  else if (irand == 3) {
    // Swap early night items
    itinerary1_in[4] = itinerary2_in[4];
    itinerary1_in[5] = itinerary2_in[5];
    itinerary2_in[4] = itinerary1Org[4];
    itinerary2_in[5] = itinerary1Org[5];
  }
  else {
    // Swap last item
    itinerary1_in[6] = itinerary2_in[6];
    itinerary2_in[6] = itinerary1Org[6];
  }

  // Collect result for output
  var itineraryOut = new Array(2);
  itineraryOut[0] = [itinerary1_in[0], itinerary1_in[1], itinerary1_in[2], itinerary1_in[3],
  itinerary1_in[4], itinerary1_in[5], itinerary1_in[6]];
  itineraryOut[1] = [itinerary2_in[0], itinerary2_in[1], itinerary2_in[2], itinerary2_in[3],
  itinerary2_in[4], itinerary2_in[5], itinerary2_in[6]];

  return itineraryOut;
}


function mutate(itinerary_in, numItemsArray_in) {
  var irand = randomIntFromInterval(0, 10); // If 0-6 chosen, individual items will be mutated
  // If 7-10 chosen, pairs of items will be mutated
  var iItemMutate = 0;
  var mutatedItinerary = itinerary_in.slice(0);
  // Mutate individual items
  if (irand <= 6) {
    iItemMutate = pickRandomItineraryItemExcluding(numItemsArray_in[irand], itinerary_in[irand]);
    mutatedItinerary[irand] = iItemMutate;
  }
  // Mutate pairs of items 
  else {
    var istart;
    var iend;
    if (irand == 7) {
      // Mutate morning items
      istart = 0;
    }
    else if (irand == 8) {
      // Mutate afternoon items
      istart = 2;
    }
    else if (irand == 9) {
      // Mutate early night items
      istart = 4;
    }
    else {
      // Mutate event4 item
      istart = 6;
    }

    iend = istart + 2;
    if (irand == 10) {
      iend = istart + 1;
    }

    for (var i = istart; i < iend; i++) {
      iItemMutate = pickRandomItineraryItemExcluding(numItemsArray_in[i], itinerary_in[i]);
      mutatedItinerary[i] = iItemMutate;
    }
  }

  return mutatedItinerary;
}