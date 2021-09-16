function getVideoList(){
    var request = new XMLHttpRequest()
    var params = (new URL(document.location)).searchParams
    request.open('POST', "/videolist?ltik=" + params.get("ltik"), true)

    request.onload = function () {
        document.getElementById("deeplinkPOST").action += "?ltik=" + params.get('ltik')

        var listdata = JSON.parse(request.response)
        var video_array = Object.keys(listdata).map((k)=>( Object.assign( { "vid": k }, listdata[k] )))
        videofilter.updateOrigin = video_array
        create_list(videofilter.VideoList())
        
        document.getElementById("filter-word").addEventListener('input', redraw_video_list)
    }
    request.send()
}

function redraw_video_list(){
    videofilter.filterword = document.getElementById("filter-word").value
    create_list(videofilter.VideoList())
}

function create_list(listdata){
    var params = (new URL(document.location)).searchParams

    document.getElementById("list-area").remove()
    var list_area = document.createElement("div")
    list_area.setAttribute("id","list-area")
    document.getElementById("deeplinkPOST").prepend(list_area)

    for (const element in listdata) {
        var one_video = document.createElement("div")
        one_video.setAttribute("class","one-video")
        var _radio = document.createElement('input')
        _radio.setAttribute("id","video-" + listdata[element].vid)
        _radio.setAttribute("type","radio")
        _radio.setAttribute("value", listdata[element].vid)
        _radio.setAttribute("name","select_video")
        _radio.onchange = selected_video

        var _label = document.createElement('label')
        _label.setAttribute("class","label")
        _label.setAttribute("for","video-" + listdata[element].vid)

        var thumbnail = document.createElement("div")
        thumbnail.setAttribute("class","label-thumbnail")
        var img_thumbnail = document.createElement('img')
        img_thumbnail.src = '/video/' + listdata[element].vid + '/' + 'thumbnail_360.jpg?ltik=' + params.get("ltik")
        img_thumbnail.onerror = function(){
            this.src='/images/no_thumbnail.jpg'
        }

        thumbnail.appendChild(img_thumbnail)
        _label.appendChild(thumbnail)

        var video_info = document.createElement("div")
        video_info.setAttribute("class","video-info")
        var video_title = document.createElement('div')
        video_title.innerHTML = listdata[element].title
        video_title.setAttribute("class","video-title")
        video_title.setAttribute("id","title-" + listdata[element].vid)
        var video_explanation = document.createElement('div')
        video_explanation.innerHTML = listdata[element].explanation
        video_explanation.setAttribute("class","video-explanation")

        video_info.appendChild(video_title)
        video_info.appendChild(video_explanation)
        _label.appendChild(video_info)


        one_video.appendChild(_radio)
        one_video.appendChild(_label)
        list_area.appendChild(one_video)

        }
    selected_video()
}

function selected_video() {
    var check_list = document.getElementsByName("select_video")
    document.getElementById("url-submit").disabled = true
    for(var i = 0; i < check_list.length; i++){
        if(check_list[i].checked) {
            console.log(check_list[i])
            document.getElementById("select_title").value = document.getElementById("title-" + check_list[i].value).innerHTML 
            document.getElementById("select_url").value = document.location.origin + "/watch?video=" + check_list[i].value + "&deeplink=true"
            document.getElementById("url-submit").disabled = false
            break
        }
    }
}

function ThemeModeInit() {
    var local_theme = localStorage.getItem("theme-mode") || false

    if(local_theme == "dark"){
        ThemeModeChange("dark-theme")
    }
    else if(local_theme == "light"){
        ThemeModeChange("light-theme")
    }
    else if(os_theme_mode){
        localStorage.setItem('theme-mode', "dark")
        ThemeModeChange("dark-theme")
    }
    else{
        localStorage.setItem('theme-mode', "light")
        ThemeModeChange("light-theme")
    }
    
}

function ThemeModeChange(mode) {
    var elements = ["logo","header","munu-btn","munu","munu-icon","overlay","memo","download-btn","download-list","filter-word","delete-area","video-input","deeplink-area","deeplink-select"]
    for(var element of elements){
        var change_theme = document.getElementsByClassName("theme-" + element)
        for(var target_theme of change_theme){
            if(mode == "light-theme"){
                target_theme.classList.remove("dark-theme-" + element)
                target_theme.classList.add("light-theme-" + element)
            }
            else{
                target_theme.classList.add("dark-theme-" + element)
                target_theme.classList.remove("light-theme-" + element)
            }
        }
    }

    if(mode == "light-theme"){
        document.body.classList.remove("dark-theme-body")
        document.body.classList.add("light-theme-body")
    }
    else{
        document.body.classList.add("dark-theme-body")
        document.body.classList.remove("light-theme-body")
    }
}

window.addEventListener("load", function() {
    getVideoList()
    ThemeModeInit()
})
