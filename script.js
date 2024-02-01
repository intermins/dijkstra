let count = 1;

function createVertice(x, y) {
    let vertice = document.createElement('div');
    vertice.classList.add('vertice');
    vertice.style.left = `${x}px`;
    vertice.style.top = `${y}px`;
    vertice.innerHTML = count;
    vertice.id = count;
    document.body.appendChild(vertice)
    count++;
}

function createLine(element) {
    let line = document.createElement('div');
    line.classList.add('line');
    source_line = line;
    move_line = true;
    source_line_x = element.getBoundingClientRect().left + 20;
    source_line_y = element.getBoundingClientRect().top + 20;
    element.appendChild(line)
}

function addWeight(weight) {
    let span = document.createElement('span');
    span.innerHTML = weight;
    source_line.appendChild(span);
}

let source_line = null;
let source_line_x = 0;
let source_line_y = 0;
let move_line= false;

document.addEventListener('mousemove', function(e){
    if(move_line && source_line) {
        angle = Math.atan((e.clientY-source_line_y)/(e.clientX-source_line_x))*180/3.14159
        if(e.clientX <= source_line_x) {
            angle += 180
        }
        width = Math.sqrt((e.clientY-source_line_y)**2+(e.clientX-source_line_x)**2);
        source_line.style.width = `${width}px`;
        source_line.style.transform = `rotate(${angle}deg)`;        
    }
});

function toggle_form() {
    document.querySelector('.weightForm').classList.toggle('hidden')
}

const input = document.querySelector('.inputBox input');

function addWeightLogic() {
    if(input.value) {
        addWeight(input.value)
        toggle_form()
    }
}

document.addEventListener('click', function(e){
    if(e.target != document.body) {
        if(move_line) {
            toggle_form();
            move_line = false;
        } else if(e.target.classList.value == 'vertice') {
            if(!e.altKey) {
                createLine(e.target);
            } else {
                e.target.remove()
            }
        }
    } else {
        if(move_line) {
            source_line.remove();
            source_line = null;
            move_line = false;
        } else {
            createVertice(e.clientX-20, e.clientY-20);
        }
    }
});