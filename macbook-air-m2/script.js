const meter = document.getElementById('scrollTop')
const switchClass = 'show'
// 
const globalNav = document.getElementById('global-nav')
const localNav = document.getElementById('local-nav')

const el = document.documentElement
var sceneLength = sceneLengthOfDiffCH(el.clientHeight)
const startPoint = globalNav.clientHeight + localNav.clientHeight
const videoAry = []

const scene_1 = new Scene('video-1-box', sceneLength + startPoint, 0, 0)
const video_1 = document.getElementById('video-1')
const _video_1 = new Video('video-1', scene_1, sceneLength, 0, startPoint)
videoAry.push({ video: video_1, controller: _video_1 })

const scene_2 = new Scene('video-2-box', sceneLength, 1, startPoint)
const video_2 = document.getElementById('video-2')
const _video_2 = new Video('video-2', scene_2, sceneLength, 1, startPoint)
videoAry.push({ video: video_2, controller: _video_2 })
const video_2_text = new MovableElement('video-2-text', scene_2, 0, 1, 'transform.translateX', -98, 98, 'px')
video_2_text.add(0, 1, '--gradient-position', 140, -40, '%')

const scene_3 = new Scene('scene-3-box', sceneLength, 2, startPoint)
const scene_3_box_wrapper_scale = new MovableElement('scene-3-box-wrapper', scene_3, 0.7, 1, 'transform.scale', 1, 0.6)
const chip_scale = new MovableElement('chip', scene_3, 0, 0.7, 'transform.scale', 8, 1, '', 'ease-out')
const scene_3_text_wrapper_scale = new MovableElement('scene-3-box-text-wrapper', scene_3, 0, 0.7, 'transform.scale', 1.5, 1)
const scene_3_text_gradient_position = new MovableElement('scene-3-box-text', scene_3, 0.6, 0.8, '--gradient-position', 140, -40, '%')

const scene_4 = new Scene('scene-4-box', sceneLength, 3, startPoint)
const scene_4_hardware_wrapper = new MovableElement('scene-4-hardware-wrapper', scene_4, 0, 0.4, '--hardware-container-scale', 4.3, 1)
scene_4_hardware_wrapper.add(0.3, 0.7, '--hardware-container-pos-y', -218, 0, 'px')
const scene_4_text = new MovableElement('scene-4-text', scene_4, 0.1, 0.75, 'transform.translateY', 218, 0, 'px')
scene_4_text.add(0.65, 0.95, '--gradient-position', 140, -40, '%')
const scene_4_startframe = new MovableElement('scene-4-startframe', scene_4, 0.4, 0.77, '--startframe-scale', 1, 0.723, '', 'ease-out')
scene_4_startframe.add(0.4, 0.77, '--startframe-translate-x', 0, 140, 'px', 'ease-out')
scene_4_startframe.add(0.4, 0.77, '--startframe-translate-y', 0, 48, 'px', 'ease-out')
const scene_4_screen_starlight = new MovableElement('scene-4-screen-starlight', scene_4, 0.8, 'mutation', 'opacity', 1, 0)
const scene_4_screen_midnight = new MovableElement('scene-4-screen-midnight', scene_4, 0.8, 'mutation', 'opacity', 0, 1)
const scene_4_ppt_light = new MovableElement('scene-4-ppt-light', scene_4, 0.8, 'mutation', 'opacity', 1, 0)
const scene_4_ppt_dark = new MovableElement('scene-4-ppt-dark', scene_4, 0.8, 'mutation', 'opacity', 0, 1)
const scene_4_powerpoint = new MovableElement('scene-4-powerpoint', scene_4, 0.4, 0.77, '--powerpoint-translate', 10, 0, 'px')
const scene_4_music = new MovableElement('scene-4-music', scene_4, 0.4, 0.77, '--music-translate', 10, 0, 'px')
const scene_4_play_button = document.getElementById('scene-4-play-button')
const video_4 = document.getElementById('video-4')

scene_4_play_button.onclick = () => {
    if(video_4.paused) {
        video_4.play()
        scene_4_play_button.classList.remove('paused')
        scene_4_play_button.classList.add('playing')
    } else {
        video_4.pause()
        scene_4_play_button.classList.add('paused')
        scene_4_play_button.classList.remove('playing')
    }
}

const scene_5 = new Scene('scene-5-box', sceneLength, 4, startPoint)
const scene_5_text_1 = new MovableElement('scene-5-text-1', scene_5, 0, 0.21, 'transform.translateY', 16.8, 0, 'px')
scene_5_text_1.add(0.53, 'mutation', 'opacity', 1, 0)
scene_5_text_1.add(0.1, 0.26, '--gradient-position', 140, -40, '%')
const scene_5_text_2 = new MovableElement('scene-5-text-2', scene_5, 0.73, 0.9, 'transform.translateY', 25.2, 0, 'px')
scene_5_text_2.add(0.76, 'mutation', 'opacity', 0, 1)
scene_5_text_2.add(0.8, 0.95, '--gradient-position', 140, -40, '%')
const scene_5_video_wrapper = new MovableElement('scene-5-video-wrapper', scene_5, 0, 0.53, 'transform.translateY', 600, 0, 'px')
const video_5 = document.getElementById('scene-5-video')
const _video_5 = new Video('scene-5-video', scene_5, sceneLength, 9, startPoint, 0.5)
videoAry.push({ video: video_5, controller: _video_5 })

// 场景六为特殊场景，出现后不会消失
const _scene_6 = new Scene('product-sticky-container', sceneLength, 5, startPoint)
const scene_6_laptop = new MovableElement('product-wrapper', _scene_6, 0.001, 0.5, '--mba-separation', 20, 0, '%', 'ease-out')

// 不同clientHeight下的场景跨度
function sceneLengthOfDiffCH(clientHeight) {
    return 1.12 * clientHeight + 2
}

const fade_in_text_group = new FadeInElement('fade-in', (y) => console.log(y))

function videoControl(videoAry) {

    videoAry.forEach(video => {
        video.video.onloadedmetadata = function() {
            window.addEventListener('scroll', () => video.controller.durationControl())
        }
    })

}
videoControl(videoAry)

function onScroll() {

    meter.innerText = el.scrollTop

    // local nav
    el.scrollTop > 44 ? localNav.classList.add('width-100p') : localNav.classList.remove('width-100p')
    // scene 1
    scene_1.switchControl(switchClass)
    // scene 2
    scene_2.switchControl(switchClass)
    video_2_text.moveControl()
    // scene 3
    scene_3.switchControl(switchClass)
    scene_3_box_wrapper_scale.moveControl()
    chip_scale.moveControl()
    scene_3_text_wrapper_scale.moveControl()
    scene_3_text_gradient_position.moveControl()
    // scene 4
    scene_4.switchControl(switchClass)
    scene_4_hardware_wrapper.moveControl()
    scene_4_text.moveControl()
    scene_4_screen_starlight.moveControl()
    scene_4_screen_midnight.moveControl()
    scene_4_startframe.moveControl()
    scene_4_ppt_light.moveControl()
    scene_4_ppt_dark.moveControl()
    scene_4_powerpoint.moveControl()
    scene_4_music.moveControl()
    //
    scene_5.switchControl(switchClass)
    scene_5_text_1.moveControl()
    scene_5_video_wrapper.moveControl()
    scene_5_text_2.moveControl()
    //
    scene_6_laptop.moveControl()
    //
    fade_in_text_group.fadeControl()
}

window.addEventListener('scroll', () => onScroll())

window.onload = () => {
    onScroll()
    // videoControl()
    videoAry.forEach(video => video.controller.durationControl())
}


// DONE: 发布-订阅模式
window.onresize = () => {
    sceneLength = sceneLengthOfDiffCH(el.clientHeight)
    
    Event.trigger('change', sceneLength)
    // 场景1 为特殊场景：场景跨度与其余场景不同
    scene_1.step = sceneLength + startPoint

    // 重新计算视频进度
    videoAry.forEach(video => video.controller.durationControl())
    
    onScroll()
}




