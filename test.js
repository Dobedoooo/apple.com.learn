var wrapper = document.querySelector('.product-container')
var axis = []
window.onscroll = function() {
    var y = wrapper.style.getPropertyValue('--mba-separation')
    axis.push({ x: document.documentElement.scrollTop, y })
}
var t = setInterval(function() {
    document.documentElement.scrollTop += 1
}, 250)

