    var peer = new Peer({
      path: '/peerjs',
      host: 'localhost',
      port: 9000
    });

    peer.on('open', function(){
      $('#my-id').text(peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
      call.answer(window.localStream);
      step3(call);
    });

    peer.on('error', function(err){
      alert(err.message);
      step2();
    });


    $('#make-call').click(function(){
      var call = peer.call($('#callto-id').val(), window.localStream);
      step3(call);
    });

    $('#end-call').click(function(){
      window.existingCall.close();
      step2();
    });

    $('#start').click(function(){
      step1();
    });

    $('#step1-retry').click(function(){
      $('#step1-error').hide();
      step1();
    });

    function step1() {
      // Get audio/video stream
      navigator.getUserMedia(
        {audio: true, video: true},
        function(stream){
          $('#my-video').prop('src', URL.createObjectURL(stream));
          window.localStream = stream;
          step2();
          console.log('in step 1');
        },
        function(){ $('#step1-error').show(); });
    }

    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3(call) {
      if (window.existingCall) {
        window.existingCall.close();
      }
      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }
