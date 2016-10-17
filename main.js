var weekDraw = function(){
  this.balls = [];
  this.euros = [];
}

var yearDraw  = function(){
  this.weekDraws = [];
  this.year = "";
  this.week = "";
};

var price = function(){
  this.week = "";
  this.year = "";
  this.priceCategory = "";
  this.priceValue = "";
}

var years = [2012, 2013, 2014, 2015];

var fullDraw = [];

function prepareCheck(){
  var valid = true;
  var tip = new weekDraw();
  
  for(var i=1; i<=5; i++){
    var tmpVal = document.getElementsByName("ball"+i)[0].value;
    if(tmpVal && tip.balls.indexOf(tmpVal) == -1){
      tip.balls.push(tmpVal);
    }else{
      valid = false;
    }
  }
  
  
  
  for(var i=1; i<=2; i++){
    var tmpVal = document.getElementsByName("euro"+i)[0].value;
    if(tmpVal && tip.euros.indexOf(tmpVal) == -1){
      tip.euros.push(tmpVal);
    }else{
      valid = false;
    }
  }
  if(valid){
    prepareFiles();
    var priceList = checkNumbers(tip);price.priceCategory
    createPriceTable(priceList);
  }else{
    alert("Please check your numbers");
  }
}

function prepareFiles(){
  years.forEach(function(year){
    readBallFile(year+"b", year+"e", year);
  })
}

function readBallFile(bFile, eFile, year)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", bFile, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0)){
          var allText = rawFile.responseText;
          readEuroFile(allText, eFile, year);
        }
    }
    rawFile.send();
}

function readEuroFile(bText, eFile, year){
  var rawFile = new XMLHttpRequest();
    rawFile.open("GET", eFile, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0)){
          var allText = rawFile.responseText;
          parseFile(bText, allText, year);
        }
    }
    rawFile.send();
}

function parseFile(bStr, eStr, year){
    
    var yearTmp = new yearDraw();
    
    var bStrWeekly = bStr.split("-");
    var eStrWeekly = eStr.split("-");
        
    for(var j = 0; j<bStrWeekly.length; j++){
      var tmp = new weekDraw();
      tmp.balls = bStrWeekly[j].split(":");
      tmp.euros = eStrWeekly[j].split(":");
      tmp.week = j;
      yearTmp.weekDraws.push(tmp);
    }
    
    yearTmp.year = year;
    fullDraw.push(yearTmp);
}

function getNumbers(year, week){
  var result = "";
  fullDraw.forEach(function(yearDraw){
    if(yearDraw.year === year){
      var draw = yearDraw.weekDraws[week-1];
      var balls = draw.balls.join(",");
      var euros = draw.euros.join(",");
      result = balls+" - "+euros;
    }
  })
  return result;
}

function checkNumbers(draw){
  var priceList = [];
  fullDraw.forEach(function(yearDraw){
    yearDraw.weekDraws.forEach(function(weekDraw){
      var correctBalls = 0;
      var correctEuros = 0;
      weekDraw.balls.forEach(function(ball){
	draw.balls.forEach(function(tipBall){
	  if(tipBall === ball){
	    correctBalls ++ ;
	  }
	});
      });
      
      weekDraw.euros.forEach(function(euro){
	draw.euros.forEach(function(tipEuro){
	  if(tipEuro === euro){
	    correctEuros ++ ;
	  }
	});
      });
     
      if(correctBalls > 0){
	var priceCategory = pricePool(correctBalls, correctEuros);
	if(priceCategory > 0){
	  var price = {};
	  price.week = weekDraw.week + 1;
	  price.year = yearDraw.year;
	  price.priceCategory = priceCategory;
	  price.priceValue = priceValue(priceCategory);
	
	  priceList.push(price);
	}
      }
      
    });
  });
  return priceList;
}

function createPriceTable(priceList){
  priceList.sort(function(a,b){return a.priceCategory - b.priceCategory});
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var trHead = document.createElement('tr');   

  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');

  var text1 = document.createTextNode('Pricegroup');
  var text2 = document.createTextNode('Price');
  var text3 = document.createTextNode('Year');
  var text4 = document.createTextNode('Week');
  var text5 = document.createTextNode('Numbers');
    
  
  td1.appendChild(text1);
  td2.appendChild(text2);
  td3.appendChild(text3);
  td4.appendChild(text4);
  td5.appendChild(text5);
  trHead.appendChild(td1);
  trHead.appendChild(td2);
  trHead.appendChild(td3);
  trHead.appendChild(td4);
  trHead.appendChild(td5);
    
  thead.appendChild(trHead);
  table.appendChild(thead);
    
  for (var i = 0; i < priceList.length; i++){
    tr = document.createElement('tr');   

    td1 = document.createElement('td');
    td2 = document.createElement('td');
    td3 = document.createElement('td');
    td4 = document.createElement('td');
    td5 = document.createElement('td');
    var att = document.createAttribute("class");       
    att.value = "width200";                          
    td5.setAttributeNode(att);     
    
    text1 = document.createTextNode(priceList[i].priceCategory);
    text2 = document.createTextNode(priceList[i].priceValue);
    text3 = document.createTextNode(priceList[i].year);
    text4 = document.createTextNode(priceList[i].week);
    text5 = document.createTextNode(getNumbers(priceList[i].year, priceList[i].week));

    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    td5.appendChild(text5);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    table.appendChild(tr);
  }
  document.body.appendChild(table);
}

function pricePool(balls, euros){
  var priceCategory = 0;
  switch(balls){
    case 1:
      switch(euros){
	case 0:
	case 1:
	  break;
	case 2:
	  priceCategory = 11;
	  break;
      }
      break;
    case 2:
      switch(euros){
	case 0:
	  break;
	case 1:
	  priceCategory = 12;
	  break;
	case 2:
	  priceCategory = 8;
	  break;
      }
      break;
    case 3:
      switch(euros){
	case 0:
	  priceCategory = 10;
	  break;
	case 1:
	  priceCategory = 9;
	  break;
	case 2:
	  priceCategory = 7;
	  break;
      }
      break;
    case 4:
      switch(euros){
	case 0:
	  priceCategory = 6;
	  break;
	case 1:
	  priceCategory = 5;
	  break;
	case 2:
	  priceCategory = 4;
	  break;
      }
      break;
    case 5:
      switch(euros){
	case 0:
	  priceCategory = 3;
	  break;
	case 1:
	  priceCategory = 2;
	  break;
	case 2:
	  priceCategory = 1;
	  break;
      }
      break;
  }
  return priceCategory;
}

function priceValue(priceCategory){
  var value;
  switch(priceCategory){
    case 1:
      value = 90000000;
      break;
    case 2:
      value = 2780570.9;
      break;
    case 3:
      value = 109022.7;
      break;
    case 4:
      value = 3276.6;
      break;
    case 5:
      value = 211.1;
      break;
    case 6:
      value = 93.8;
      break;
    case 7:
      value = 46.1;
      break;
    case 8:
      value = 17.3;
      break;
    case 9:
      value = 16.9;
      break;
    case 10:
      value = 14.2;
      break;
    case 11:
      value = 8.3;
      break;
    case 12:
      value = 7.5;
      break;
  }
  return value+" €";
}