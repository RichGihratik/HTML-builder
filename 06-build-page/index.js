const { createWriteStream, createReadStream } = require('fs');
const { readdir, readFile, copyFile, mkdir, rm } = require('node:fs/promises');
const { extname, join, parse } = require('path');


// CONSTANTS
// ==============================

// Source names
// -------------------------

const assetsFolderName = 'assets';
const stylesFolderName = 'styles';
const componentsFolderName = 'components';
const templateName = 'template.html';

// Dist Names
// -------------------------

const cssBundleName = 'style.css';
const htmlBundleName = 'index.html';

// Dist Paths
// -------------------------

const distPath = join(__dirname, 'project-dist');
const distAssets = join(distPath, assetsFolderName);
const distCssBundle = join(distPath, cssBundleName);
const distHtmlBundle = join(distPath, htmlBundleName);

// Source Paths
// -------------------------

const assetsPath = join(__dirname, assetsFolderName);
const stylesPath = join(__dirname, stylesFolderName);
const componentsPath = join(__dirname, componentsFolderName);
const templatePath = join(__dirname, templateName);


// MAIN
// ==============================

async function init() {
    await rm(distPath, { recursive: true, force: true });
    await mkdir(distPath);
}

async function main() {
    await init();
    copyAssets();
    bundleCss();
    bundleHtml();
}

main();

// HTML
// ==============================

async function getComponents() {
    let result = {};
    let files = (await readdir( componentsPath, { encoding: "utf8", withFileTypes: true }));
    for (let file of files) {
        if (file.isFile() && extname(file.name) === '.html') {
            result[parse(file.name).name] = await readFile(join(componentsPath, file.name), 'utf8');
        }
    }
    return result;
}

function replaceTags(template, componentsMap) {
    let regex = /{{([^{}]*)}}/g;

    template = template.replace(regex, (match, tagName) => {
        let component = componentsMap[tagName];
        if (component !== undefined) return component;
        else return `<strong> TAG "${tagName}" NOT FOUND! </strong>`;
    })
    if (regex.test(template)) 
        template = replaceTags(template, componentsMap);
    return template;
}

async function bundleHtml() {
    console.log('Bundle html...');
    let writeStream = createWriteStream(distHtmlBundle,  'utf8');

    let template = await readFile(templatePath, 'utf8');
    let tags = await getComponents();

    let html = await replaceTags(template, tags);
    writeStream.write(html);
}

// ASSETS
// ==============================

async function copyAssets() {
    console.log('Copying assets...');
    let copyPath = async (subDir) => {
        let internalPath = join(assetsPath, subDir);
        let files = (await readdir(internalPath, { encoding: "utf8", withFileTypes: true }));

        for (let file of files) {
            if (file.isFile()) {
                await copyFile(join(internalPath, file.name), join(distAssets, subDir, file.name))
            }
            else if (file.isDirectory()) {
                let dir = join(subDir, file.name);
                await mkdir(join(distAssets, dir));
                await copyPath(dir);
            }
        }
    }
    await mkdir(distAssets, { recursive: true });
    copyPath('');
}


// CSS
// ==============================

async function bundleCss() {
    console.log('Bundle css...');
    let writeStream = createWriteStream(distCssBundle, 'utf8');
    let streams = [];
    (await readdir( stylesPath, { encoding: "utf8", withFileTypes: true }))
    .forEach(file => {
        if (file => file.isFile() && extname(file.name) === '.css') {
            let stream = createReadStream(join(stylesPath, file.name), 'utf8')
            stream.on('end', () => {
                    streams.shift();
                    writeStream.write('\n');
                    if (streams.length !== 0) streams[0].pipe(writeStream, { end: false });
                    console.log(`Done! ${file.name}`);
            })
            streams.push(stream);
        }
    });
    if (streams.length !== 0) streams[0].pipe(writeStream, { end: false });
}