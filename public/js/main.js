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
  let catagoryValue="";
  const len=x.length;
  let count=0;
    for (i = 0; i < len; i++) {
      if(count>0 && x[i].checked == true)
      {
        html = html + ", " ;
        catagoryValue=catagoryValue+",";
      }
      if(x[i].checked == true)
      {
        let fields= x[i].value.split('-');
        catagoryValue=catagoryValue+fields[0];
        html = html + fields[1];
        count++;
      }
     }
     catagori.value=catagoryValue;
     catagori.innerHTML=html;
}