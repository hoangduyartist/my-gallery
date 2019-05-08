$(window).ready(function () {

    $('#upload-btn').on('click', () => {
        // alert('click');
    })


    $('.fancybox').fancybox({
        openEffect: 'elastic',
        closeEffect: 'elastic',
    });

    $('.carousel').carousel({indicators: true});
    // {fullWidth: true}
    setInterval(()=>{
        $('.carousel').carousel('next');
    },3000)

})