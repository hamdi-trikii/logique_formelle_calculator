const calculator_buttons = document.querySelectorAll(".calculator_button");
const calculator_monitor=document.querySelector(".calculator_monitor");
const popup=document.querySelector(".popup");
const popup2=document.querySelector(".popup2");


let variables=[]


/*write the formula on the monitor */
calculator_buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        calculator_monitor.innerHTML+=button.textContent;
        if(!variables.includes(button.textContent)&& /^[a-zA-Z]+$/.test(button.textContent)){
            variables.push(button.textContent)
            
            
        }
    });
});
/*clear the monitor*/
const calculator_button_del=document.querySelector(".calculator_button_del");
calculator_button_del.addEventListener('click',function() {
    calculator_monitor.style.color="black"
    calculator_monitor.innerHTML="";
    variables.length=0
    while(popup.lastChild){
        popup.lastChild.remove();
    }
    if(!popup.classList.contains('hidden')){
        popup.classList.toggle('hidden')
    } 
})
/*check if the formula is well writen*/
function checkformula(){
    
    let str=calculator_monitor.textContent.replace(/\s/g,'')
    
    if(!(/^[a-zA-Z()¬]+$/.test(str[0]))){
        calculator_monitor.style.color="red"
        
        return false;
        
    }
    let nb1=0
    let nb2=0
    if(str[0]=="("){
        nb1+=1
    }
    if(str[0]==")"){
        nb2+=1
    }
    for( i=1;i<str.length;i++){
        
        if(str[i]=="("){
            nb1+=1
        }
        if(str[i]==")"){
            nb2+=1
        }
        if (/^[a-zA-Z¬]+$/.test(str[i])&&/^[a-zA-Z]+$/.test(str[i-1])||(!(/^[a-zA-Z()¬]+$/.test(str[i]))&&!(/^[a-zA-Z()¬]+$/.test(str[i-1])))){
            calculator_monitor.style.color="red"
            return false;
        }
        if(i==(str.length)-1&&!/^[a-zA-Z)]+$/.test(str[i])){
            calculator_monitor.style.color="red"
            return false;
        }
    }
    if(nb1!=nb2){
        calculator_monitor.style.color="red"
        return false;
    }
    
    return true;
    
}
/*variables button*/
const calculator_button_variables=document.querySelector(".calculator_button_variables");
calculator_button_variables.addEventListener('click',function() {
    
    if(checkformula()){
        calculator_monitor.style.color="black"
        for (i=0;i<variables.length;i++){
           
            popup.insertAdjacentHTML('beforeend',`${variables[i]}<input type="checkbox" id='sw${i}' class="switch" checked> </input><br>`)
        }
        popup.insertAdjacentHTML('beforeend',`<input class='done' type="button" value="done"></input><br>`)
        

        popup.classList.toggle('hidden');
        
        let done=document.querySelector(".done")
        done.addEventListener('click',function() {
            let bool=[];
            for(let i=0;i<variables.length;i++){
                let check=document.getElementById(`sw${i}`)
                if(check.checked){
                    bool[i]=true
                }
                else{
                    bool[i]=false
                }
            }

            /*regenerate str */
            let i=0
            calculator_monitor.style.color="black"
            let str=calculator_monitor.textContent
            while(i<str.length){
                let first_part=str.slice(0,i)
                let sec_part=str.slice(i+1,str.length)

                if(/^[⇔]+$/.test(str[i])){
                    first_part=find_first_part(i,str,first_part)
                    sec_part=find_sec_part(i,str,sec_part)
                    console.log("fp=",first_part)
                    console.log("scp=",sec_part)
                    console.log('mlawl',str.slice(0,str.indexOf(first_part)))
                    
                    str=str.slice(0,str.indexOf(first_part))+'((!'+first_part+'∨'+sec_part+')∧('+first_part+'∨!'+sec_part+'))'+str.slice(str.indexOf(sec_part)+sec_part.length,str.length)
                }
                else if(/^[→]+$/.test(str[i])){
                    first_part=find_first_part(i,str,first_part)
                    sec_part=find_sec_part(i,str,sec_part)
                    console.log("fp=",first_part)
                    console.log("scp=",sec_part)
                    console.log('mlawl',str.slice(0,str.indexOf(first_part)))
                    
                    str=str.slice(0,str.indexOf(first_part))+'(!('+first_part+')∨('+sec_part+'))'+str.slice(str.indexOf(sec_part)+sec_part.length,str.length)

                }
                else if(/^[⊕]+$/.test(str[i])){
                    first_part=find_first_part(i,str,first_part)
                    sec_part=find_sec_part(i,str,sec_part)
                    console.log("fp=",first_part)
                    console.log("scp=",sec_part)
                    str=str.slice(0,str.indexOf(first_part))+'(('+first_part+'∧!'+sec_part+')∨(!'+first_part+'∧'+sec_part+'))'+str.slice(str.indexOf(sec_part)+sec_part.length,str.length)
                }
                console.log(str)
                i+=1
            
            }

            let tablehtml=`<table border='||'class="popup2table">`
            let rowhtml='<tr>' 
            for (i=0;i<variables.length;i++){
                rowhtml+=`<td>${variables[i]}</td>`
            }

            rowhtml+=`<td style="background-color: rgba(236,194,118,0.6)">${calculator_monitor.textContent}</td></tr>`
            tablehtml+=rowhtml
            let formula=""
            for(k=0;k<str.length;k++){
                if(/^[a-zA-Z]+$/.test(str[k])){
                    formula+=bool[variables.indexOf(str[k])].toString()
                }
                 else if(/^[∨]+$/.test(str[k])){
                    formula+="||"
    
                }
                else if(/^[∧]+$/.test(str[k])){
                    formula+="&&"
                }
                else if(/^[(]+$/.test(str[k])){
                    formula+="("
    
                }
                else if(/^[)]+$/.test(str[k])){
                    formula+=")"
                }
                else if(/^[¬!]+$/.test(str[k])){
                    formula+="!"
                }
            }
            console.log(formula)
            console.log(eval(formula))
            rowhtml='<tr>'
            for(j=0;j<variables.length;j++){
                rowhtml+=`<td>${Number(bool[j])}</td>`
            }
            rowhtml+=`<td style="background-color: rgba(236,194,118,0.6)">${Number(eval(formula))}</td></tr>`
            tablehtml+=rowhtml
            tablehtml+='</table>'
            popup2.insertAdjacentHTML('beforeend',`${tablehtml}`)
            popup.classList.toggle('hidden')
            popup2.classList.toggle('hidden2')
            while(popup.lastChild){
                popup.lastChild.remove();
            }
        })



    }
    
})
/*backspace button*/
const calculator_button_backspace=document.querySelector('.calculator_button_backspace')
calculator_button_backspace.addEventListener('click',function() {
    let myString=calculator_monitor.textContent
    let char=myString[myString.length-1]
    
    let charCount = myString.match(new RegExp(char, "g"))?.length || 0;
    
    if( charCount==1){
        variables=variables.filter(item => item !==char);
        

    }
    
    while(popup.lastChild){
        popup.lastChild.remove();
    }
    if(!popup.classList.contains('hidden')){
        popup.classList.toggle('hidden')
    } 
   
    calculator_monitor.textContent=calculator_monitor.textContent.slice(0,-1)

})

function closepopup(){
    if(!popup2.classList.contains('hidden2')){
        popup2.classList.toggle('hidden2');

    }
    popup2.lastChild.remove();

}




function find_first_part(i,str,first_part){
    if(str[i-1]==')'){
        
        let c_closed=1
        let c_open=0
        for (k=i-2;k>=0;k=k-1){
            if(str[k]==')'){
                c_closed+=1

            }
            else if(str[k]=='('){
                c_open+=1
            }
            console.log(str[k])
            if(c_closed== c_open){
                
                return str.slice(k,i)
            }
        }
    }
    else{
        for(k=i-2;k>=0;k=k-1){
            if(str[k]=='('){
                return str.slice(k+1,i)
            }
        }
    }
    return first_part
    
}
function find_sec_part(i,str,sec_part){
    if(str[i+1]=='('){
        let c_closed=0
        let c_open=1
        for(k=i+2;k<=str.length;k++){
            if(str[k]=='('){
                c_open+=1
            }
            else if(str[k]==')'){
                c_closed+=1
            }
            if(c_closed== c_open){
                return str.slice(i+1,k+1)
            }
        }

    }
    else{
        for(k=i+2;k<=str.length;k++){
            if(str[k]==')'){
                return str.slice(i+1,k)
            }
        }
    }
    return sec_part

    
}

/*truthtable button*/
const calculator_button_truthtable=document.querySelector('.calculator_button_truthtable')
calculator_button_truthtable.addEventListener('click',function() {
    nb_possiblities=Math.pow(2,variables.length)
    
    
    if(checkformula()){
        calculator_monitor.style.color="black"
        let str=calculator_monitor.textContent
        /*regenerate str */
        let i=0
        while(i<str.length){
            let first_part=str.slice(0,i)
            let sec_part=str.slice(i+1,str.length)

            if(/^[⇔]+$/.test(str[i])){
                first_part=find_first_part(i,str,first_part)
                sec_part=find_sec_part(i,str,sec_part)
                console.log("fp=",first_part)
                console.log("scp=",sec_part)
                console.log('mlawl',str.slice(0,str.indexOf(first_part)))
                
                str=str.slice(0,str.indexOf(first_part))+'((!'+first_part+'∨'+sec_part+')∧('+first_part+'∨!'+sec_part+'))'+str.slice(str.indexOf(sec_part)+sec_part.length,str.length)

                


            }
            else if(/^[→]+$/.test(str[i])){
                first_part=find_first_part(i,str,first_part)
                sec_part=find_sec_part(i,str,sec_part)
                console.log("fp=",first_part)
                console.log("scp=",sec_part)
                console.log('mlawl',str.slice(0,str.indexOf(first_part)))
                
                str=str.slice(0,str.indexOf(first_part))+'(!('+first_part+')∨('+sec_part+'))'+str.slice(str.indexOf(sec_part)+sec_part.length,str.length)

            }
            else if(/^[⊕]+$/.test(str[i])){
                first_part=find_first_part(i,str,first_part)
                sec_part=find_sec_part(i,str,sec_part)
                console.log("fp=",first_part)
                console.log("scp=",sec_part)
                str=str.slice(0,str.indexOf(first_part))+'(('+first_part+'∧!'+sec_part+')∨(!'+first_part+'∧'+sec_part+'))'+str.slice(str.indexOf(sec_part)+sec_part.length,str.length)
            }
            console.log(str)
            i+=1
            
        }

        //convert formula in pc language so he can do all the calcule
        let bool=[]
        let changeevery=[1];
        let change=[1];
        let tablehtml=`<table border='||'class="popup2table">`
        let rowhtml='<tr>'
        
        for (i=0;i<variables.length;i++){
            bool.push(true)
            changeevery.push(changeevery[i]*2)
            change.push(change[i]*2)
            rowhtml+=`<td>${variables[i]}</td>`
        }
        rowhtml+=`<td style="background-color: rgba(236,194,118,0.6)">${calculator_monitor.textContent}</td></tr>`
        tablehtml+=rowhtml
        
        
        for(i=0;i<nb_possiblities;i++){
            let formula=""
            
            for(k=0;k<str.length;k++){
                if(/^[a-zA-Z]+$/.test(str[k])){
                    
                    formula+=bool[variables.indexOf(str[k])].toString()
                    
                }
                else if(/^[∨]+$/.test(str[k])){
                    formula+="||"

                }
                else if(/^[∧]+$/.test(str[k])){
                    formula+="&&"

                }
                else if(/^[(]+$/.test(str[k])){
                    formula+="("

                }
                else if(/^[)]+$/.test(str[k])){
                    formula+=")"
                }
                else if(/^[¬!]+$/.test(str[k])){
                    formula+="!"

                }
            }
            console.log(formula)
            console.log(eval(formula))
           

            rowhtml='<tr>'
            for(j=0;j<variables.length;j++){
                change[j]=change[j]-1;
                rowhtml+=`<td>${Number(bool[j])}</td>`
                if(change[j]==0){
                    if(bool[j]==true){
                        bool[j]=false
                    }
                    else{
                        bool[j]=true
                    }
                   
                    change[j]=changeevery[j]
                }
                  
            }
            rowhtml+=`<td style="background-color: rgba(236,194,118,0.6)">${Number(eval(formula))}</td>`
            rowhtml+='</tr>'
            tablehtml+=rowhtml
  
        }
        tablehtml+='</table>'
        popup2.insertAdjacentHTML('beforeend',`${tablehtml}`)
        popup2.classList.toggle('hidden2')

        a=true
        b=false
        

    }

    
})