$(document).ready(() => {
  var mainContent = $('div.maincontent');
  var badge_detail_tasks = $('div.badge_detail_tasks', mainContent)[0];
  var cards = $('div.badge_card_set_card.owned', badge_detail_tasks);
  var downloaderButton = $(`<button class="downloader">Download Cards</button>`);

  var gamecard_details = $('div.badge_content.gamecard_details');
  var craft_button = $('div.badge_craft_button', gamecard_details);
  var offset = $(craft_button).offset();
  $(downloaderButton).css({
    top: offset.top,
    left: offset.left + $(craft_button).width() + 30,
    height: $(craft_button).height(),
    backgroundColor: $(craft_button).css('backgroundColor'),
    color: $(craft_button).css('color'),
  });
  $(downloaderButton).click(() => {

    $.each(cards, (idx, card) => {
      var cardZoom = $($('div.game_card_ctn.with_zoom', card)[0]);
      var imgLink = cardZoom.attr('onclick');
      var startPos = imgLink.indexOf("http:");
      var endPos = imgLink.indexOf('"', startPos);
      imgLink = imgLink.substring(startPos, endPos);

      var cardText = $($('div.badge_card_set_text.ellipsis', card)[0]);
      var name = $(cardText).clone().children().remove().end().text().trim();

      downloadImage($('img', card).attr('src'), `${idx+1}. ${name}.png`, 'png')
      downloadImage(imgLink, `${idx+1}. ${name}.jpg`, 'jpeg')
    });
  })
  $('body').append(downloaderButton);
})

function downloadImage(src, filename, type) {
  fetch(src)
    .then(response => response.blob()).
    then((blob) => {
      var link = document.createElement('a');
      document.body.appendChild(link);
      file = new Blob([blob], { type : `image/${type}` });
      link.href = window.URL.createObjectURL(file);
      link.download = filename;
      link.click();
      document.body.removeChild(link);
    })
}