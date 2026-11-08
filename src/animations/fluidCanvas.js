export function initFluid2(){ if(typeof window==="undefined") return {dispose(){}}; const __c=document.getElementById("fluid2"); if(!__c) return {dispose(){}}; try {const r=document.getElementById("fluid2");Ge();let e={SIM_RESOLUTION:48,DYE_RESOLUTION:384,DENSITY_DISSIPATION:5.5,VELOCITY_DISSIPATION:3.8,PRESSURE:.12,PRESSURE_ITERATIONS:6,CURL:1.2,SPLAT_RADIUS:.035,SPLAT_FORCE:1700,SHADING:!1,COLOR_UPDATE_SPEED:.5};function t(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let n=[];n.push(new t);const{gl:i,ext:s}=a(r);s.supportLinearFiltering||(e.DYE_RESOLUTION=512,e.SHADING=!1);function a(R){const F={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let B=R.getContext("webgl2",F);const z=!!B;z||(B=R.getContext("webgl",F)||R.getContext("experimental-webgl",F));let Y,oe;z?(B.getExtension("EXT_color_buffer_float"),oe=B.getExtension("OES_texture_float_linear")):(Y=B.getExtension("OES_texture_half_float"),oe=B.getExtension("OES_texture_half_float_linear")),B.clearColor(0,0,0,1);const pe=z?B.HALF_FLOAT:Y.HALF_FLOAT_OES;let Ke,de,De;return z?(Ke=o(B,B.RGBA16F,B.RGBA,pe),de=o(B,B.RG16F,B.RG,pe),De=o(B,B.R16F,B.RED,pe)):(Ke=o(B,B.RGBA,B.RGBA,pe),de=o(B,B.RGBA,B.RGBA,pe),De=o(B,B.RGBA,B.RGBA,pe)),{gl:B,ext:{formatRGBA:Ke,formatRG:de,formatR:De,halfFloatTexType:pe,supportLinearFiltering:oe}}}function o(R,F,B,z){if(!l(R,F,B,z))switch(F){case R.R16F:return o(R,R.RG16F,R.RG,z);case R.RG16F:return o(R,R.RGBA16F,R.RGBA,z);default:return null}return{internalFormat:F,format:B}}function l(R,F,B,z){let Y=R.createTexture();R.bindTexture(R.TEXTURE_2D,Y),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_MIN_FILTER,R.NEAREST),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_MAG_FILTER,R.NEAREST),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_WRAP_S,R.CLAMP_TO_EDGE),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_WRAP_T,R.CLAMP_TO_EDGE),R.texImage2D(R.TEXTURE_2D,0,F,4,4,0,B,z,null);let oe=R.createFramebuffer();return R.bindFramebuffer(R.FRAMEBUFFER,oe),R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Y,0),R.checkFramebufferStatus(R.FRAMEBUFFER)==R.FRAMEBUFFER_COMPLETE}class c{constructor(F,B){this.vertexShader=F,this.fragmentShaderSource=B,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(F){let B=0;for(let Y=0;Y<F.length;Y++)B+=U(F[Y]);let z=this.programs[B];if(z==null){let Y=d(i.FRAGMENT_SHADER,this.fragmentShaderSource,F);z=h(this.vertexShader,Y),this.programs[B]=z}z!=this.activeProgram&&(this.uniforms=f(z),this.activeProgram=z)}bind(){i.useProgram(this.activeProgram)}}class u{constructor(F,B){this.uniforms={},this.program=h(F,B),this.uniforms=f(this.program)}bind(){i.useProgram(this.program)}}function h(R,F){let B=i.createProgram();return i.attachShader(B,R),i.attachShader(B,F),i.linkProgram(B),i.getProgramParameter(B,i.LINK_STATUS)||console.trace(i.getProgramInfoLog(B)),B}function f(R){let F=[],B=i.getProgramParameter(R,i.ACTIVE_UNIFORMS);for(let z=0;z<B;z++){let Y=i.getActiveUniform(R,z).name;F[Y]=i.getUniformLocation(R,Y)}return F}function d(R,F,B){F=g(F,B);const z=i.createShader(R);return i.shaderSource(z,F),i.compileShader(z),i.getShaderParameter(z,i.COMPILE_STATUS)||console.trace(i.getShaderInfoLog(z)),z}function g(R,F){if(F==null)return R;let B="";return F.forEach(z=>{B+="#define "+z+`
`}),B+R}const _=d(i.VERTEX_SHADER,`
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),m=d(i.VERTEX_SHADER,`
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),p=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform sampler2D uTexture;

    void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
    }
`),x=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),v=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),b=d(i.FRAGMENT_SHADER,`
    precision mediump float;

    uniform vec4 color;

    void main () {
        gl_FragColor = color;
    }
`),S=`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;

    vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
    }

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;

        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
    #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
`,M=d(i.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`),w=d(i.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;

        vec2 iuv = floor(st);
        vec2 fuv = fract(st);

        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
    #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
    #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }`,s.supportLinearFiltering?null:["MANUAL_FILTERING"]),P=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`),T=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`),y=d(i.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`),L=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`),N=d(i.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`),G=(i.bindBuffer(i.ARRAY_BUFFER,i.createBuffer()),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),i.STATIC_DRAW),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,i.createBuffer()),i.bufferData(i.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),i.STATIC_DRAW),i.vertexAttribPointer(0,2,i.FLOAT,!1,0,0),i.enableVertexAttribArray(0),(R,F=!1)=>{R==null?(i.viewport(0,0,i.drawingBufferWidth,i.drawingBufferHeight),i.bindFramebuffer(i.FRAMEBUFFER,null)):(i.viewport(0,0,R.width,R.height),i.bindFramebuffer(i.FRAMEBUFFER,R.fbo)),F&&(i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT)),i.drawElements(i.TRIANGLES,6,i.UNSIGNED_SHORT,0)});let W,O,K,te,j;Fe("../app/themes/flipp/dist/images/LDR_LLL1_0.png"),new u(m,p);const ae=new u(_,x),I=new u(_,v);new u(_,b);const le=new u(_,M),xe=new u(_,w),Je=new u(_,P),ke=new u(_,T),Se=new u(_,y),J=new u(_,L),ne=new u(_,N),he=new c(_,S);function we(){let R=fe(e.SIM_RESOLUTION),F=fe(e.DYE_RESOLUTION);const B=s.halfFloatTexType,z=s.formatRGBA,Y=s.formatRG,oe=s.formatR,pe=s.supportLinearFiltering?i.LINEAR:i.NEAREST;i.disable(i.BLEND),W==null?W=Ue(F.width,F.height,z.internalFormat,z.format,B,pe):W=C(W,F.width,F.height,z.internalFormat,z.format,B,pe),O==null?O=Ue(R.width,R.height,Y.internalFormat,Y.format,B,pe):O=C(O,R.width,R.height,Y.internalFormat,Y.format,B,pe),K=be(R.width,R.height,oe.internalFormat,oe.format,B,i.NEAREST),te=be(R.width,R.height,oe.internalFormat,oe.format,B,i.NEAREST),j=Ue(R.width,R.height,oe.internalFormat,oe.format,B,i.NEAREST)}function be(R,F,B,z,Y,oe){i.activeTexture(i.TEXTURE0);let pe=i.createTexture();i.bindTexture(i.TEXTURE_2D,pe),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,oe),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,oe),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,B,R,F,0,z,Y,null);let Ke=i.createFramebuffer();i.bindFramebuffer(i.FRAMEBUFFER,Ke),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pe,0),i.viewport(0,0,R,F),i.clear(i.COLOR_BUFFER_BIT);let de=1/R,De=1/F;return{texture:pe,fbo:Ke,width:R,height:F,texelSizeX:de,texelSizeY:De,attach(Ze){return i.activeTexture(i.TEXTURE0+Ze),i.bindTexture(i.TEXTURE_2D,pe),Ze}}}function Ue(R,F,B,z,Y,oe){let pe=be(R,F,B,z,Y,oe),Ke=be(R,F,B,z,Y,oe);return{width:R,height:F,texelSizeX:pe.texelSizeX,texelSizeY:pe.texelSizeY,get read(){return pe},set read(de){pe=de},get write(){return Ke},set write(de){Ke=de},swap(){let de=pe;pe=Ke,Ke=de}}}function lt(R,F,B,z,Y,oe,pe){let Ke=be(F,B,z,Y,oe,pe);return ae.bind(),i.uniform1i(ae.uniforms.uTexture,R.attach(0)),G(Ke),Ke}function C(R,F,B,z,Y,oe,pe){return R.width==F&&R.height==B||(R.read=lt(R.read,F,B,z,Y,oe,pe),R.write=be(F,B,z,Y,oe,pe),R.width=F,R.height=B,R.texelSizeX=1/F,R.texelSizeY=1/B),R}function Fe(R){let F=i.createTexture();i.bindTexture(i.TEXTURE_2D,F),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.REPEAT),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.REPEAT),i.texImage2D(i.TEXTURE_2D,0,i.RGB,1,1,0,i.RGB,i.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let B={texture:F,width:1,height:1,attach(Y){return i.activeTexture(i.TEXTURE0+Y),i.bindTexture(i.TEXTURE_2D,F),Y}},z=new Image;return z.onload=()=>{B.width=z.width,B.height=z.height,i.bindTexture(i.TEXTURE_2D,F),i.texImage2D(i.TEXTURE_2D,0,i.RGB,i.RGB,i.UNSIGNED_BYTE,z)},z.src=R,B}function Oe(){let R=[];e.SHADING&&R.push("SHADING"),he.setKeywords(R)}Oe(),we();let Ae=Date.now(),k=0;function je(){const R=Ee();Ge()&&we(),me(R),ft(),Math.random()<.015&&(n[0].deltaX*=2.2,n[0].deltaY*=2.2),D(R),E(null),requestAnimationFrame(je)}function Ee(){let R=Date.now(),F=(R-Ae)/1e3;return F=Math.min(F,.016666),Ae=R,F}function Ge(){let R=Ne(r.clientWidth),F=Ne(r.clientHeight);return r.width!=R||r.height!=F?(r.width=R,r.height=F,!0):!1}function me(R){k+=R*e.COLOR_UPDATE_SPEED,k>=1&&(k=Pe(k,0,1),n.forEach(F=>{F.color=Be()}))}function ft(){n.forEach(R=>{R.moved&&(R.moved=!1,ie(R))})}function D(R){i.disable(i.BLEND),ke.bind(),i.uniform2f(ke.uniforms.texelSize,O.texelSizeX,O.texelSizeY),i.uniform1i(ke.uniforms.uVelocity,O.read.attach(0)),G(te),Se.bind(),i.uniform2f(Se.uniforms.texelSize,O.texelSizeX,O.texelSizeY),i.uniform1i(Se.uniforms.uVelocity,O.read.attach(0)),i.uniform1i(Se.uniforms.uCurl,te.attach(1)),i.uniform1f(Se.uniforms.curl,e.CURL),i.uniform1f(Se.uniforms.dt,R),G(O.write),O.swap(),Je.bind(),i.uniform2f(Je.uniforms.texelSize,O.texelSizeX,O.texelSizeY),i.uniform1i(Je.uniforms.uVelocity,O.read.attach(0)),G(K),I.bind(),i.uniform1i(I.uniforms.uTexture,j.read.attach(0)),i.uniform1f(I.uniforms.value,e.PRESSURE),G(j.write),j.swap(),J.bind(),i.uniform2f(J.uniforms.texelSize,O.texelSizeX,O.texelSizeY),i.uniform1i(J.uniforms.uDivergence,K.attach(0));for(let B=0;B<e.PRESSURE_ITERATIONS;B++)i.uniform1i(J.uniforms.uPressure,j.read.attach(1)),G(j.write),j.swap();ne.bind(),i.uniform2f(ne.uniforms.texelSize,O.texelSizeX,O.texelSizeY),i.uniform1i(ne.uniforms.uPressure,j.read.attach(0)),i.uniform1i(ne.uniforms.uVelocity,O.read.attach(1)),G(O.write),O.swap(),xe.bind(),i.uniform2f(xe.uniforms.texelSize,O.texelSizeX,O.texelSizeY),s.supportLinearFiltering||i.uniform2f(xe.uniforms.dyeTexelSize,O.texelSizeX,O.texelSizeY);let F=O.read.attach(0);i.uniform1i(xe.uniforms.uVelocity,F),i.uniform1i(xe.uniforms.uSource,F),i.uniform1f(xe.uniforms.dt,R),i.uniform1f(xe.uniforms.dissipation,e.VELOCITY_DISSIPATION),G(O.write),O.swap(),s.supportLinearFiltering||i.uniform2f(xe.uniforms.dyeTexelSize,W.texelSizeX,W.texelSizeY),i.uniform1i(xe.uniforms.uVelocity,O.read.attach(0)),i.uniform1i(xe.uniforms.uSource,W.read.attach(1)),i.uniform1f(xe.uniforms.dissipation,e.DENSITY_DISSIPATION),G(W.write),W.swap()}function E(R){i.blendFunc(i.ONE,i.ONE_MINUS_SRC_ALPHA),i.enable(i.BLEND),q(R)}function q(R){let F=i.drawingBufferWidth,B=i.drawingBufferHeight;he.bind(),e.SHADING&&i.uniform2f(he.uniforms.texelSize,1/F,1/B),i.uniform1i(he.uniforms.uTexture,W.read.attach(0)),G(R)}function ie(R){let F=R.deltaX*e.SPLAT_FORCE,B=R.deltaY*e.SPLAT_FORCE;ee(R.texcoordX,R.texcoordY,F,B,R.color)}function re(R){const F=Be();F.r*=10,F.g*=10,F.b*=10;let B=10*(Math.random()-.5),z=30*(Math.random()-.5);ee(R.texcoordX,R.texcoordY,B,z,F)}function ee(R,F,B,z,Y){le.bind(),i.uniform1i(le.uniforms.uTarget,O.read.attach(0)),i.uniform1f(le.uniforms.aspectRatio,r.width/r.height),i.uniform2f(le.uniforms.point,R,F),i.uniform3f(le.uniforms.color,B,z,0),i.uniform1f(le.uniforms.radius,Me(e.SPLAT_RADIUS/100)),G(O.write),O.swap(),i.uniform1i(le.uniforms.uTarget,W.read.attach(0)),i.uniform3f(le.uniforms.color,Y.r,Y.g,Y.b),G(W.write),W.swap()}function Me(R){let F=r.width/r.height;return F>1&&(R*=F),R}window.addEventListener("mousedown",R=>{let F=n[0],B=Ne(R.clientX),z=Ne(R.clientY);ce(F,-1,B,z),re(F)}),window.addEventListener("mousemove",R=>{let F=n[0],B=Ne(R.clientX),z=Ne(R.clientY);je(),Re(F,B,z,Be())},{once:!0}),window.addEventListener("mousemove",R=>{let F=n[0],B=Ne(R.clientX),z=Ne(R.clientY),Y=F.color;Re(F,B,z,Y)}),window.addEventListener("touchstart",R=>{const F=R.targetTouches;let B=n[0];for(let z=0;z<F.length;z++){let Y=Ne(F[z].clientX),oe=Ne(F[z].clientY);je(),ce(B,F[z].identifier,Y,oe)}},{once:!0}),window.addEventListener("touchstart",R=>{const F=R.targetTouches;let B=n[0];for(let z=0;z<F.length;z++){let Y=Ne(F[z].clientX),oe=Ne(F[z].clientY);ce(B,F[z].identifier,Y,oe)}}),window.addEventListener("touchmove",R=>{const F=R.targetTouches;let B=n[0];for(let z=0;z<F.length;z++){let Y=Ne(F[z].clientX),oe=Ne(F[z].clientY);Re(B,Y,oe,B.color)}},!1),window.addEventListener("touchend",R=>{const F=R.changedTouches;let B=n[0];for(let z=0;z<F.length;z++)ve(B)});function ce(R,F,B,z){R.id=F,R.down=!0,R.moved=!1;const Y=.0015;R.texcoordX=B/r.width+(Math.random()-.5)*Y,R.texcoordY=1-z/r.height+(Math.random()-.5)*Y,R.prevTexcoordX=R.texcoordX,R.prevTexcoordY=R.texcoordY,R.deltaX=0,R.deltaY=0,R.color=Be()}function Re(R,F,B,z){R.prevTexcoordX=R.texcoordX,R.prevTexcoordY=R.texcoordY,R.texcoordX=F/r.width,R.texcoordY=1-B/r.height,R.deltaX=ue(R.texcoordX-R.prevTexcoordX),R.deltaY=ge(R.texcoordY-R.prevTexcoordY),R.moved=Math.abs(R.deltaX)>0||Math.abs(R.deltaY)>0,R.color=z}function ve(R){R.down=!1}function ue(R){let F=r.width/r.height;return F<1&&(R*=F),R}function ge(R){let F=r.width/r.height;return F>1&&(R/=F),R}function Be(){return{r:.8+Math.random()*.2,g:Math.random()*.01,b:Math.random()*.02}}function Pe(R,F,B){let z=B-F;return(R-F)%z+F}function fe(R){let F=i.drawingBufferWidth/i.drawingBufferHeight;F<1&&(F=1/F);let B=Math.round(R),z=Math.round(R*F);return i.drawingBufferWidth>i.drawingBufferHeight?{width:z,height:B}:{width:B,height:z}}function Ne(R){let F=window.devicePixelRatio||1;return Math.floor(R*F)}function U(R){if(R.length==0)return 0;let F=0;for(let B=0;B<R.length;B++)F=(F<<5)-F+R.charCodeAt(B),F|=0;return F}; } catch(e){ console.warn("fluid2 init failed",e); } return { dispose(){} }; }