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
            else {
            }
        })
}

function format() {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });

    var afterFormat = formatter.format(document.getElementById('amount').value * 1.05);
    console.log(afterFormat)
    document.getElementById('calMoney').innerHTML = afterFormat
}

function calFeeTrans() {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });

    var afterFormat = formatter.format(document.getElementById('amount').value * 0.05);
    console.log(afterFormat)
    document.getElementById('calMoney').innerHTML = '* ' + afterFormat
}
function getValue() {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });

    var afterFormat = formatter.format(document.getElementById('amount').value);
    document.getElementById('formatMoney').innerHTML = '* ' + afterFormat
}

function sendConfirmTRSAdmin(username,type,receiver,amount,idDetail,note,feeBearer){
    var getConfirm=confirm('B???n ch???c ch???n mu???n duy???t giao d???ch n??y ?')
    if(getConfirm){
        console.log(username,receiver,amount,idDetail,note,feeBearer)
        fetch('http://localhost:3000/confirmtransactionadmin',{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body:JSON.stringify({username,type,receiver,amount,idDetail,note,feeBearer})
        })
        .then((res)=>{
            return res.json()
        })
        .then((message)=>{
            if(message.code==1){
                alert('Duy???t th??nh c??ng')
                location.reload();

            }
        })
    }    
}

function getName() {
    var sdt = document.getElementById('sdt').value
    fetch('http://localhost:3000/getnameuser', {
        method: 'POST',
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({ sdt: sdt })
    })
        .then(function (res) {
            return res.json()
        })
        .then(function (name) {
            if (name.nameUser) {
                console.log(name.nameUser)
                document.getElementById('autoFillName').innerHTML = `                                
            <p class="text mb-1 text-danger">T??n ng?????i nh???n: ${name.nameUser}</p>                                
            `
            }
            if (name.err) {
                document.getElementById('autoFillName').innerHTML = `                                
            <p class="text mb-1 text-danger">${name.err}</p>                                
            `
                console.log(name.err)
            }
        })
}


function alertUpdate(data){
    if(data=='Ch??? c???p nh???t'){
        document.getElementById('alert').style.display='block'
        document.getElementById('buttonUpdate').style.display='block'
    }

}
function menuToggle(money) {
    const toggleMenu = document.querySelector('.menuuser');
    toggleMenu.classList.toggle('active')
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });

    var afterFormat = formatter.format(money);
    console.log(afterFormat)
    document.getElementById('amountUser').innerHTML =afterFormat
}


function sendStatusAcc(){
    if(confirm("B???n mu???n c???p nh???t tr???ng th??i cho t??i kho???n n??y?")){
        var trang_thai=document.getElementById('trangthai').value
        var username = document.getElementById('username').innerText
        fetch('/updatestateacc',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({trang_thai,username})
        }).then(function(res){
            return res.json()
        })
        .then(function(message){
            if(message.status=='success'){
                alert('C???p nh???t th??nh c??ng')
                location.reload()
    
            }
        })
    }
    

 
}