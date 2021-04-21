function resetData() {
  Swal.fire({
    title: 'ลบข้อมูลผู้ป่วยใช่หรือไม่?',
    text: "คุณต้องการลบข้อมูลผู้ป่วยใช่หรือไม่",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545',
    confirmButtonText: 'ใช่',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'ลบข้อมูลสำเร็จ!',
        'คุณลบข้อมูลผู้ป่วยสำเร็จ',
        'success'
      )
      setInterval(() => {
        window.location.href = '/trolley/resetcsv'
      }, 2000);
    }else{
      window.location.href = '/trolley/detail-trolley/1'
    }
    
  })
 
  //return confirm('คุณต้องการออกจากระบบหรือไม่',window.location.href='/trolley/resetcsv')
}

function senddata() {
  const myform = document.getElementById('myform')
  myform.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    fetch('/upload', {
      method: 'post',
      body: formData,
    })
  })
}

function load() {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'บันทึกข้อมูลสำเร็จ',
    showConfirmButton: false,
    timer: 3000
  })
  setInterval(() => {
    window.location.href = '/trolley/detail-trolley/1'
  }, 2000);
}

// function test() {
//   window.location.href = '/trolley/detail-trolley/1'
 
// }
