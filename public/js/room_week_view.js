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


jQuery(window).load(function () {
  jQuery('.cal-room-selector').each(function (index, value) {
    jQuery(this).change(updateRooms)
  })
});
