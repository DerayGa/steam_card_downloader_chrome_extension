$(document).ready(() => {
  var mainContent = $('div.maincontent');
  var badge_detail_tasks = $('div.badge_detail_tasks', mainContent)[0];
  var cards = $('div.badge_card_set_card', badge_detail_tasks);
  var downloadTxt = chrome.i18n.getMessage("download");
  var downloaderButton = $(`<button class="downloader">${downloadTxt}</button>`);

  var gamecard_details = $('div.badge_content.gamecard_details');
  var craft_button = $('div.badge_craft_button', gamecard_details);
  var parameter;
  if (craft_button.length) {
    parameter = $(craft_button).offset();
    parameter.height = $(craft_button).height();
    parameter.width = $(craft_button).width() + 30;
    parameter.backgroundColor = $(craft_button).css('backgroundColor');
    parameter.color = $(craft_button).css('color');
  } else {
    parameter = $(gamecard_details).offset();
    parameter.width = $(gamecard_details).width() + 30;
    parameter.height = $(gamecard_details).height();
    parameter.backgroundColor = '#5491CF';
    parameter.color = '#FFF';
  }
  $(downloaderButton).css({
    top: parameter.top,
    left: parameter.left + parameter.width,
    height: parameter.height,
    backgroundColor: parameter.backgroundColor,
    color: parameter.color,
  });

  $( window ).resize(function() {
    if (craft_button.length) {
      parameter.left = $(craft_button).offset().left;
    } else {
      parameter.left = $(gamecard_details).offset().left;
    }
    $(downloaderButton).css({
      left: parameter.left + parameter.width,
    });
  });

  $(downloaderButton).click(() => {

    $.each(cards, (idx, card) => {
      var cardZoom = $($('div.game_card_ctn.with_zoom', card)[0]);
      var imgLink = cardZoom.attr('onclick');
      if (imgLink) {
        var startPos = imgLink.indexOf("http:");
        var endPos = imgLink.indexOf('"', startPos);
        imgLink = imgLink.substring(startPos, endPos);
      }

      var cardText = $($('div.badge_card_set_text.ellipsis', card)[0]);
      var name = $(cardText).clone().children().remove().end().text().trim();
      downloadImage($('img', card).attr('src'), `${idx+1}. ${name}.png`, 'png');
      if (imgLink) {
        downloadImage(imgLink, `${idx+1}. ${name}.jpg`, 'jpeg');
      }
    });
  })
  $('body').append(downloaderButton);
})

function downloadImage(src, filename, type) {
  fetch(src)
    .then(response => response.blob())
    .then((blob) => {
      var link = document.createElement('a');
      document.body.appendChild(link);
      file = new Blob([blob], { type : `image/${type}` });
      link.href = window.URL.createObjectURL(file);
      link.download = filename;
      link.click();
      document.body.removeChild(link);
    })
}