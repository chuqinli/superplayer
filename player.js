$(document).ready(function(){
var oldvol;
  $("#submit").on("click",function(){
    onSubmit();
  });
});
function onSubmit(){

  if($(".video").length>0){
    $(".video").remove();
  }

  var addr = $("#remoteVideoURL").val();
  var addr1 = $("#remoteVideoURL1").val();

  $('#video_player').append("<div id=\"video\" class = \"video\" style=\"width:600px;height:400px;\"></div>");
  $('#video_player1').append("<div id=\"video1\" class = \"video\" style=\"width:600px;height:400px;\"></div>");

  var video = Popcorn.smart("#video", addr);
  var video1 = Popcorn.smart("#video1",addr1);

  singlecontrol(0,video);
  singlecontrol(1,video1);
  globalcontrol(video,video1);
  
}
function globalcontrol(video,video1){
  $("#playbtn").on("click",function(){   
    video.play();
    video1.play();
    $("#playpausebtn0")[0].style.background = "url(pause.png)";
    $("#playpausebtn1")[0].style.background = "url(pause.png)";
  });
  $("#pausebtn").on("click",function(){
    video.pause();
    video1.pause();
    $("#playpausebtn0")[0].style.background = "url(play.png)";
    $("#playpausebtn1")[0].style.background = "url(play.png)";  
  });
  $("#mutebtn2").on("click",function(){
    v1f = video.muted();
    v2f = video1.muted();
    //needs more consideration
    if(v1f == true && v2f == true){
      video.unmute();
      video1.unmute();
    }
    else if(v1f == true && v2f == false){
      video.unmute();
      video1.mute();
    }
    else if(v1f == false && v2f == true){
      video1.unmute();
      video.mute();
    }
    else{
      video.mute();
      video1.mute();
    }
  });
  console.log("1"+video.duration());
  console.log("2"+video1.duration());
  if(video.duration()>=video1.duration()){
    vid = video;
  }
  else{
    vid = video1;
  }
  var curtimetext = $('#curtimetext2')[0];
  var durtimetext = $('#durtimetext2')[0];
  vid.on("timeupdate",function(){
    $('#seekslider2')[0].value = vid.currentTime()*(100 / vid.duration());
    timeupdate(vid,curtimetext,durtimetext);
  });

  $('#volumeslider2').on("input",function(){
      video.volume($(this)[0].value/100);
      video1.volume($(this)[0].value/100);
      //console.log(vid.volume());
  });
  $('#seekslider2').on("input",function(){
        var seekto;
        seekto = vid.duration() * ($(this)[0].value / 100);
        video.currentTime(seekto);
        video1.currentTime(seekto);
  });

}
function singlecontrol(id,vid){
  vid.play();
  $("#playpausebtn"+id).on("click",function(){
      if(vid.paused()){
        vid.play();
        this.style.background = "url(pause.png)";
      }else{
        vid.pause();
        this.style.background = "url(play.png)";
      }   
  });

  vid.on("timeupdate",function(){
    var curtimetext = $('#curtimetext'+id)[0];
    var durtimetext = $('#durtimetext'+id)[0];
    $('#seekslider'+id)[0].value = vid.currentTime()*(100 / vid.duration());
    timeupdate(vid,curtimetext,durtimetext);
  });

  $('#seekslider'+id).on("input",function(){
        var seekto;
        seekto = vid.duration() * ($(this)[0].value / 100);
        vid.currentTime(seekto);
  });
  $('#mutebtn'+id).on("click",function(){
      if(vid.muted()){
          vid.unmute();
          $('#volumeslider'+id)[0].value = oldvol*100;
          $(this).css('backgroundImage','url(unmute.png)');
      }else {
          oldvol = vid.volume();
          vid.mute();
          $('#volumeslider'+id)[0].value = 0;
          $(this).css('backgroundImage','url(mute.png)');
      }   
  });
  $('#volumeslider'+id).on("input",function(){
      vid.volume($(this)[0].value/100);
      //console.log(vid.volume());
  });
}
function timeupdate(vid,ctext,dtext){
    var curmins = Math.floor(vid.currentTime() / 60);
    var cursecs = Math.floor(vid.currentTime() - curmins * 60);
    var durmins = Math.floor(vid.duration() / 60);
    var dursecs = Math.floor(vid.duration() - durmins * 60);
    if(cursecs < 10){ cursecs = "0"+cursecs; }
    if(dursecs < 10){ dursecs = "0"+dursecs; }
    if(curmins < 10){ curmins = "0"+curmins; }
    if(durmins < 10){ durmins = "0"+durmins; }
    ctext.innerHTML = curmins+":"+cursecs;
    dtext.innerHTML = durmins+":"+dursecs;
}
