$(window).ready(function () {

    $('#upload-btn').on('click', () => {
        // alert('click');
        // M.toast({html: 'I am a toast!', classes: 'rounded'});
    })

    $('#test-btn').on('click', () => {
        alert('click');
    })

    $('.fancybox').fancybox({
        openEffect: 'elastic',
        closeEffect: 'elastic',
    });

    $('.carousel').carousel({indicators: true});
    // {fullWidth: true}
    setInterval(()=>{
        $('.carousel').carousel('next');
    },4000)

    $('.modal').modal();

    $('.sidenav-trigger').sideNav();
    $('#nav-trigger-btn').sideNav();

})