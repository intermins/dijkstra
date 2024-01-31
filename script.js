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
    source_line_x = element.getBoundingClientRect().left + 20;
    source_line_y = element.getBoundingClientRect().top + 20;
    element.appendChild(line)
}

let source_line = null;
let source_line_x = 0;
let source_line_y = 0;

document.addEventListener('mousemove', function(e){
    if(source_line) {
        angle = Math.atan((e.clientY-source_line_y)/(e.clientX-source_line_x))*180/3.14159
        if(e.clientX <= source_line_x) {
            angle += 180
        }
        width = Math.sqrt((e.clientY-source_line_y)**2+(e.clientX-source_line_x)**2);
        source_line.style.width = `${width}px`;
        source_line.style.transform = `rotate(${angle}deg)`;        
    }
});

document.addEventListener('click', function(e){
    if(e.target != document.body) {
        createLine(e.target)
    } else {
        if(source_line) {
            source_line.remove();
            source_line = null;
        } else {
            createVertice(e.clientX-20, e.clientY-20);
        }
    }
});