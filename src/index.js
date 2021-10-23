import domready from "domready"
// noinspection ES6UnusedImports
import STYLE from "./style.css"
import Color from "./Color";

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type {CanvasRenderingContext2D}
 */
let ctx;
let canvas;


function circle(x,y,size)
{
    ctx.beginPath();
    ctx.moveTo(x,y)
    ctx.arc(x,y, size, 0, TAU, true);
    ctx.fill();
}

const tmp = new Color(0,0,0)
const bg = Color.from("#004")

const shredOffset = 32;

function blob()
{
    const { width, height } = config;

    const rnd = Math.random();
    const size = 30 + (rnd*rnd*rnd) * 200;
    const dsize = size * 4;
    const cx = dsize + Math.random() * (width - dsize * 2)
    const cy = dsize + Math.random() * (height - dsize * 2)


    const color = Color.fromHSL(Math.random(), 1, 0.5);
    //console.log({cx,cy,size,color: color.toRGBHex()})

    color.mix(bg, 0.4, tmp);
    ctx.fillStyle = tmp.toRGBA(0.4);
    circle(cx,cy, size);

    color.mix(bg, 0.2, tmp);
    ctx.fillStyle = tmp.toRGBA(0.4);

    circle(cx,cy, size - 10);


    ctx.fillStyle = color.toRGBA(0.4);
    circle(cx,cy, size - 20);
}


function shred()
{
    const { width, height } = config;

    ctx.save();

    const rmax = TAU / 50;

    ctx.translate(width/2, height/2)
    ctx.rotate(Math.random() * rmax - rmax/2);
    ctx.translate(-width/2, -height/2)

    const len = Math.ceil(Math.sqrt(width * width + height * height) + 1);

    const a0 = Math.random() * Math.PI;


    const cx = Math.random() * width / 4 - width/8
    const cy = Math.random() * height / 4 - height/8

    //console.log(a0, a0 * 360 /TAU)
    let x0 = cx + width/2 + Math.cos(a0) * len;
    let y0 = cy + height/2 + Math.sin(a0) * len;
    const a1 = a0 + Math.PI;
    let x1 = cx + width/2 + Math.cos(a1) * len;
    let y1 = cy + height/2 + Math.sin(a1) * len;


    if (y1 < y0)
    {
        let tmp;

        tmp = x0;
        x0 = x1;
        x1 = tmp;

        tmp = y0;
        y0 = y1;
        y1 = tmp;

    }

    ctx.beginPath();

    ctx.moveTo(x0,y0);
    ctx.lineTo(x1, y1);

    ctx.arc(0,0, len, a0, a1, true);
    ctx.clip();


    const a2 = Math.random() * TAU;
    const amp = Math.random() * (shredOffset * 0.9) + shredOffset * 0.1;

    const dx = Math.cos(a2) * amp;
    const dy = Math.sin(a2) * amp;

    ctx.drawImage(canvas, dx, dy);

    ctx.restore();
}


let opCount = 0;


function generate()
{
    const numOps = Math.floor(Math.random() * 25 + 150);

    for (let i = 0; i < 10; i++)
    {
        blob();
    }

    opCount = numOps;

    const anim = () => {

        if (Math.random() < 0.33333)
        {
            blob();
        }
        else
        {
            shred();
        }

        if (--opCount > 0)
        {
            requestAnimationFrame(anim);
        }

    }
    requestAnimationFrame(anim);
}


function clear()
{
    const { width, height } = config;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
}


domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;
        clear();
        generate();
    }
);


document.addEventListener("click", () => {
    if (opCount === 0)
    {
        clear();
        generate();
    }


}, true)

