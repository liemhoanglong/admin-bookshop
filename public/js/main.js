var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

function changeStatus(){
  var x = document.getElementsByClassName("catagoriCheckbox");
  var catagori = document.getElementById('catagories');
  var i;
  let html="";
  const len=x.length;
  let count=0;
    for (i = 0; i < len; i++) {
      if(count>0 && x[i].checked == true)
      html = html + ", " ;
      if(x[i].checked == true)
      {
        html = html + x[i].value;
        count++;
      }
     }
     catagori.innerHTML=html;
}