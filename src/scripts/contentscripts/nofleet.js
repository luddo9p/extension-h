if ($('form').length == 0) {
  location.href =
    Hyperiums7.getServletUrl('Maps?search=&searchplanets=') +
    $('.planetNameHuge').text()
}
