$(document).ready(function(){
    $('#error').hide()
    $('#link').hide()  
    $('#image').hide() 
    $('.loader').hide()
})
$('.submitBtn').click(function(){
    $('#error').hide()
    $('#link').attr('href' , "");
    $('#image').attr('src' , "");
    $('#link').hide()
    $('#image').hide()
})
function scrollWin() {
    window.scrollTo(0, 150);
  }
function myFunction() {
    $('.loader').show()
    $('.toggleSwitch').hide()
    scrollWin()
    $('#full').attr('checked', false)
    $('.submitBtn').attr('disabled',true)
    var url = ($("#url").val())
    url = url.replace(/(^\w+:|^)\/\//, '');
    var fullpage = $("#full").is(':checked');
    var d = new Date();
    var n = d.getTime();
    let fullFileName = url + '-' + n + '.png'
        // document.getElementById('image').src = 'api/?' + 'url=' + url + '&fullpage=' + fullpage;
    fetch('api/?url=' + url + '&fullpage=' + fullpage).then(response => response.json())
    .then(data => {console.log(data)
        $('#error').hide()
        
        $('#link').attr('download', fullFileName)
        document.getElementById('image').src = data.imageurl;
        document.getElementById('link').href = data.imageurl;
        $('#link').show()
         $('#image').show()
         $('.loader').hide()
        $('.toggleSwitch').show()
         $('.submitBtn').attr('disabled',false)
        })
    .catch(error => {
        console.log(error)
        $('#link').hide()
        $('#error').show()
        $('.loader').hide()
        $('.toggleSwitch').show()
        $('.submitBtn').attr('disabled',false)});
};