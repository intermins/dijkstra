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
let move_line = false;

let graph = {};
let source_vertice = '';
let execute_vertice = '';

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
        toggle_form();
        if(graph[source_vertice]) {
            graph[source_vertice].push([execute_vertice, Number(input.value)])
        } else {
            graph[source_vertice] = [[execute_vertice, Number(input.value)]];
        }
        if(graph[execute_vertice]) {
            graph[execute_vertice].push([source_vertice, Number(input.value)])
        } else {
            graph[execute_vertice] = [[source_vertice, Number(input.value)]];
        }
    }
}

function dijkstra(start_node, finish_node) {
    let visited = {};
    visited[start_node] = null
    let markers = {};
    markers[start_node] = 0
    let deque = [start_node];
    while(deque.length > 0) {
        current_node = deque.shift();

        next_nodes = graph[current_node];
        if(next_nodes) {
            next_nodes.forEach((next_node)=>{
                if(!(next_node[0] in markers) || (markers[current_node] < markers[next_node[0]])) {
                    markers[next_node[0]] = markers[current_node] + next_node[1];
                    visited[next_node[0]] = current_node;
                    deque.push(next_node[0]);
                }
            });
        }
    }
    let path = [];
    let path_node = finish_node;
    while(path_node) {
        path.push(path_node)
        path_node = visited[path_node];
    }
    document.querySelector('.marker').classList.add('marker-push')
    document.querySelector('.marker').innerHTML = markers[finish_node];
    return path
}

function found_path(start, end) {
    path = dijkstra(start, end);
    for(let i = 0; i < path.length; i++) {
        document.querySelector(`.vertice[id='${path[i]}']`).classList.add('visited');
        vertice_line = document.querySelector(`.vertice[id='${path[i]}']`);
        lines = vertice_line.querySelectorAll('.line');
        if(i-1 > 0) {
            before = path[i-1];
        } else {
            before = path[0]
        }
        if(i+1 < path.length) {
            after = path[i+1]
            after = path[path.length-1]
        }
        lines.forEach((e)=>{
            console.log(e)
            if(e.id == before || e.id == after) {
                e.classList.add('visited')
            }
        });
    }
    console.log(path)
}

let source_choice = false;
let end_choice = false;
let source = null;
let finish = null;

document.addEventListener('click', function(e){
    if(e.target != document.body) {
        if(move_line) {
            toggle_form();
            move_line = false;
            execute_vertice = e.target.id;
            source_line.id = execute_vertice;
        } else if(e.target.classList.value == 'vertice') {
            if(end_choice) {
                finish = e.target.id;
                end_choice = false;
                document.querySelector('.pushes').classList.remove('push');
                found_path(source, finish)
            } else if(source_choice) {
                source = e.target.id;
                source_choice = false;
                document.querySelector('.pushes').classList.remove('push');
                setTimeout(() => {
                    document.querySelector('.pushes').innerHTML = 'Choose a finish vertice';
                    document.querySelector('.pushes').classList.add('push');
                    end_choice = true;
                }, 400);
            } else if(!e.altKey) {
                createLine(e.target);
                source_vertice = e.target.id;
            } else {
                vertices = graph[e.target.id];
                delete graph[e.target.id]
                line = e.target.querySelector('.line')
                if(line) {
                    line.remove();
                }
                e.target.remove()
                if(vertices) {
                    for(let i = 0; i < vertices.length; i++) {
                        this_id = vertices[i][0];
                        vertice_del = document.getElementById(this_id).querySelectorAll('.line')
                        if(vertice_del.length > 0) {
                            for(let j = 0; j < vertice_del.length; j++) {
                                if(vertice_del[j].id == e.target.id) {
                                    vertice_del[j].remove();
                                }
                            }
                        }
                    }
                }
                keys = Object.keys(graph); 
                for(let g = 0; g < keys.length; g++) {
                    for(let h = 0; h < graph[keys[g]].length; h++) {
                        if(graph[keys[g]][h][0] == e.target.id) {
                            console.log(graph[keys[g]][h][0])
                            delete graph[keys[g]][h];
                        }
                    }
                }
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

function start_path() {
    document.querySelectorAll('.visited').forEach((e)=>{
        e.classList.remove('visited')
    })
    document.querySelector('.marker').classList.remove('marker-push')
    document.querySelector('.pushes').innerHTML = 'Choose a source vertice'
    document.querySelector('.pushes').classList.add('push')
    source_choice = true;
    end_choice = false;
}

function reset() {
    document.querySelectorAll('.visited').forEach((e)=>{
        e.classList.remove('visited')
    })
    document.querySelector('.marker').classList.remove('marker-push')
    document.querySelector('.pushes').classList.remove('push')
    source_choice = false;
    end_choice = false;
}
function remove_all() {
    graph = {};
    vertices = document.querySelectorAll('.vertice');
    vertices.forEach((e)=>{
        e.remove();
    });
}