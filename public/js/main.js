$('#customFile1').change(function (e) {
    console.log(e.target)
    var fileName = e.target.files[0].name;
    console.log(fileName)
    $('#labelFile1').html(fileName);
});

$('#customFile2').change(function (e) {
    var fileName = e.target.files[0].name;
    console.log(fileName)
    $('#labelFile2').html(fileName);
});

window.setTimeout(function () {
    $(".alert").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
    });
}, 5000);


function validEmail() {
    
    getEmail = document.getElementById('email').value
    console.log(getEmail)
    fetch('http://localhost:3000/validemail', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ email: getEmail })
    })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            if (data.code == 1) {
                document.getElementById('alert').innerHTML = `<div class="alert alert-danger" role="alert">
                ${data.message}
                </div>`
            }
        })
}