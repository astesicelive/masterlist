const randomTitle = `<div><h2 class="rando">Random Story</h2></div>`
const storyArray = document.querySelectorAll('.item');
 
document.getElementById('selectStory').onclick = () => selectStory();
 
const selectStory = () => {
    var $ransto = $('.random');
    $('.grid').isotope( 'remove', $ransto );
    let random = Math.floor(Math.random() * storyArray.length);
    var $pickedStory = $('<div class="random item">' + randomTitle + storyArray[random].innerHTML + '</div>');
    $('.grid').prepend($pickedStory).isotope('prepended', $pickedStory);
 }

function cs__appendClasses() {
  var $ch = $('td:nth-child(1)');
  $($ch).each(function () {
    $ch.addClass('chapters');
  });
  var $rel = $('td:nth-child(2)');
  $($rel).each(function () {
    $rel.addClass('release');
  });
//  var $info = $('.item table');
//  $($info).each(function () {
//    $info.addClass('info');
//  });
}

cs__appendClasses();
 
function cs__add() {
  $('p#synopsis').before(
    '<h3><span>Synopsis</span></h3>'
  );
  $('.chlist:not(#animation)').before(
    '<h3><span>Chapter List</span></h3>'
  );
  $('.chlist#animation').before(
    '<h3><span>Episode List</span></h3>'
  );
  $('.charalist').before(
    '<p align="center"><hr></p>'
  );
  $("table:not([id]) tbody").prepend(
    '<tr><th>chapters</th><th>release</th><th>read</th></tr>'
  );
  $('table#shortStory tbody').prepend(
    '<tr><th>season</th><th>release</th><th>read</th></tr>'
  );
  $('table#novel tbody').prepend(
    '<tr><th>novel</th><th>release</th><th>read</th></tr>'
  );
  $('table#stagePlay tbody').prepend(
    '<tr><th>release</th><th>watched</th></tr>'
  );
  $('table#animation tbody').prepend(
    '<tr><th>episodes</th><th>release</th><th>watched</th></tr>'
  );
  $('table.info tr:last-child').append(
    '<td><label class="container"><input type="checkbox" checked="checked"><span class="checkmark"></span></label></td></tr>'
  );
}

cs__add();

function cs__convertCharactersToIcons() {
  $(".characters").each(function () {
    try {
      const $charactersDiv = $(this);
      const characters = $charactersDiv
        .html()
        .toLowerCase()
        .replace(/ /g, "")
        .replace(/"/g, "")
        .replace(/<divclass=/g, ",")
        .replace(/><\/div>/g, "")
        .split(",")
        .filter((v) => v);
      console.log(characters);
      characters.forEach((c) => {
        $charactersDiv.closest("div.item").addClass(c);
      });
      $charactersDiv.html(
        characters.map((c) => '<div class="' + c + '"></div>').join("")
      );
    } catch {}
  });
}

 cs__convertCharactersToIcons();

function cs__translatedStatus() {
  // utility function that just sets the classes for us
  function setClassesTranslated($item, state) {
    if (state) {
      $item.addClass("tl");
    } else {
      $item.removeClass("tl");
    }
  }

  // for each card on the page,
  // *can be changed to a different selector if just checkbox isnt specific enough
  $(`.item`).each(function () {
    const $thisCard = $(this);
    const hasTranslation = !!$thisCard.has("a[href]").length;
    console.log(hasTranslation);
    setClassesTranslated($thisCard, hasTranslation);
  });
}

cs__translatedStatus();

function cs__getReadingProgress() {
  let read = 0,
    unread = 0;
  // get reading list from localStorage first
  let readingList = JSON.parse(localStorage.getItem("cs__readingList"));

  // if one doesnt exist (aka. user opened page for the first time) make an empty list
  if (!readingList) {
    localStorage.setItem("cs__readingList", JSON.stringify({}));
    readingList = {};
  }

  $(`[type="checkbox"]`).each(function () {
    // get the important related elements
    const $thisCheckbox = $(this);
    const $thisCard = $thisCheckbox.closest(".item");
    const $thisHeading = $thisCard.find("h2");

    // get the story name from the h2
    const storyName = $thisHeading.text();

    // check if story is read yet from our reading list
    const isRead = readingList[storyName] || false;

    if (isRead) read++;
    else unread++;
  });
  console.log("Reading ", read, unread);
    $("[readingProgress]").attr("readingProgress", `${Math.floor((read / (read + unread)) * 10000) / 100}%`);
  $("[readingProgress]").css("width", `${(read / (read + unread)) * 100}%`);
}

$(function () {
  cs__getReadingProgress();
});

$(`[type="checkbox"]`).on("change", function (e) {
  cs__getReadingProgress();
});
