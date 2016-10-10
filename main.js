var weekDraw = function(){
  this.balls = [];
  this.euros = [];
}

var yearDraw  = function(){
  this.weekDraws = [];
  this.year = "";
};

var years = [2012, 2013, 2014, 2015];

var fullDraw = [];

function prepareFiles(){
  for(var i = 0; i<years.length; i++){
    readBallFile(years[i]+"b", years[i]+"e", years[i]);
  }
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
      yearTmp.weekDraws.push(tmp);
    }
    
    yearTmp.year = year;
    fullDraw.push(yearTmp);
}
