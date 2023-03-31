/**
 * Three tasks:
 * - show all rooms and hide the others
 * - at least one room must be selected
 * - in the last column the right border must be made thicker
 */
function updateRooms() {
  var lastRoom = null;
  jQuery('.cal-room-selector').each(function (index, value) {
    var room = this.id;
    const column = jQuery(".cal-" + room);
    if (jQuery("#" + room).prop("checked")) {
      lastRoom = room;
      column.show();
    } else {
      column.hide();
    }
    jQuery(".cal-" + room).removeClass("cal-col-right");
  });
  // No room selected, reselect the last deselected room
  if (!lastRoom) {
    jQuery(this).prop("checked", true);
    lastRoom = jQuery(this).prop("id");
    jQuery(".cal-" + lastRoom).show();
  }
  jQuery(".cal-" + lastRoom).addClass("cal-col-right");
}

const pinchZoom = (element) => {
  let start = {};

  // Calculate distance between two fingers
  const distance = (event) => {
    return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
  };

  element.on('touchstart', (event) => {
    if (event.touches.length === 2) {
      event.preventDefault(); // Prevent page scroll

      start.distance = distance(event);
      start.scale = jQuery(element).css('--cal-scale');
    }
  });

  element.on('touchmove', (event) => {
    if (event.touches.length === 2) {
      event.preventDefault(); // Prevent page scroll

      // Safari provides event.scale as two fingers move on the screen
      // For other browsers just calculate the scale manually
      let scale;
      if (event.scale) {
        scale = event.scale;
      } else {
        const deltaDistance = distance(event);
        scale = deltaDistance / start.distance;
      }
      elementScale = Math.min(Math.max(0.2, scale*start.scale), 2);
      jQuery(element).css('--cal-scale', elementScale);
    }
  });
}


jQuery(window).load(function () {
  jQuery('.cal-room-selector').each(function (index, value) {
    jQuery(this).change(updateRooms)
  })
  jQuery('.calendar').each(function (index, value) {
    pinchZoom(jQuery(this));
  })
  updateRooms();
});