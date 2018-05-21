function Modals() {
  document.querySelectorAll('[id^="modal-"]')
    .forEach(function ($modal) {
      document.querySelectorAll('#' + $modal.id + ' .modal-close, .' + $modal.id + '-toggle')
        .forEach(function ($toggle) {
          $toggle.addEventListener('click', function () {
            $modal.classList.toggle('is-active')
            if ($modal.classList.contains('is-active')) {
              $modal.dispatchEvent(new CustomEvent('sot#modal-open'))
            } else {
              $modal.dispatchEvent(new CustomEvent('sot#modal-close'))
            }
          })
        })
    })
}