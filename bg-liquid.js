const canvas = document.getElementById('logo-liquid');
    const gl = canvas.getContext('webgl2', { alpha: true }); 

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    const vsSource = `#version 300 es
    in vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }`;

    const fsSource = `#version 300 es
    precision highp float;
    out vec4 fragColor;
    
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // Fonction pour générer le fluide avec beaucoup plus de DÉSORDRE
    float getVal(vec2 uv) {
        // 1. Grandes turbulences (tord l'espace globalement)
        vec2 warp = uv;
        warp.x += sin(uv.y * 5.0 + u_time * 0.5) * 0.15;
        warp.y += cos(uv.x * 5.0 - u_time * 0.4) * 0.15;
        
        // 2. Petites turbulences (casse les lignes parfaites, crée des "déchirures")
        warp.x += sin(warp.y * 12.0 - u_time * 0.8) * 0.08;
        warp.y += cos(warp.x * 12.0 + u_time * 0.9) * 0.08;

        // 3. Génération du motif avec l'espace froissé
        // On réduit le multiplicateur Y (ex: 8.0) pour avoir de gros tourbillons, 
        // et on ajoute le X de façon agressive pour détruire l'effet "rayure horizontale"
        float pattern = warp.y * 8.0 + sin(warp.x * 6.0 + u_time * 0.7) * 2.5;
        
        return sin(pattern) * 0.5 + 0.5;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 aspectUV = uv;
        aspectUV.x *= aspect;
        
        vec2 center = vec2(0.5 * aspect, 0.5);
        vec2 mouse = vec2(u_mouse.x / u_resolution.x * aspect, 1.0 - u_mouse.y / u_resolution.y);

        // --- OPTIQUE : LENTILLE DE RÉFRACTION ---
        // 1. La bulle du Logo
        vec2 dCenter = aspectUV - center;
        float distCenter = length(dCenter);
        float forceCenter = exp(-distCenter * distCenter * 25.0); 
        vec2 offsetCenter = dCenter * forceCenter * 0.8;

        // 2. La bulle de la Souris
        vec2 dMouse = aspectUV - mouse;
        float distMouse = length(dMouse);
        float forceMouse = exp(-distMouse * distMouse * 35.0); 
        vec2 offsetMouse = dMouse * forceMouse * 0.6;

        vec2 baseUV = aspectUV - offsetCenter - offsetMouse;

        // --- EFFET CHROMATIQUE ET COULEURS ---
        float shift = (u_mouse.x / u_resolution.x - 0.5) * 0.06;
        
        float valR = getVal(baseUV + vec2(0.0, shift));
        float valG = getVal(baseUV);
        float valB = getVal(baseUV - vec2(0.0, shift));

        vec3 dark = vec3(0.06, 0.01, 0.12);   // Violet très sombre
        vec3 neon = vec3(0.55, 0.0, 0.85);    // Lueur Violette/Rose
        vec3 white = vec3(1.0, 0.9, 1.0);     // Coeur blanc lumineux

        vec3 colR = mix(dark, neon, smoothstep(0.3, 0.65, valR));
        colR = mix(colR, white, smoothstep(0.7, 1.0, valR));
        
        vec3 colG = mix(dark, neon, smoothstep(0.3, 0.65, valG));
        colG = mix(colG, white, smoothstep(0.7, 1.0, valG));

        vec3 colB = mix(dark, neon, smoothstep(0.3, 0.65, valB));
        colB = mix(colB, white, smoothstep(0.7, 1.0, valB));

        // --- TRANSPARENCE POUR LA GRILLE ---
        float luminance = (colR.r + colG.g + colB.b) / 3.0;
        float alpha = mix(0.4, 1.0, smoothstep(0.1, 0.5, luminance)); 

        fragColor = vec4(colR.r, colG.g, colB.b, alpha);
    }`;

    function compileShader(type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    const tStart = performance.now();

    function render() {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, currentX, currentY);
        gl.uniform1f(uTime, (performance.now() - tStart) / 1000);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    
    render();