const dropZone = document.querySelector(".drop-zone")
const browseBtn = document.querySelector(".browseBtn")
const fileInput = document.querySelector("#fileInput")

const bgProgress = document.querySelector(".bg-progress")
const progressContainer = document.querySelector(".progress-container")
const percentContainer = document.querySelector(".percent-container")
const percentDiv = document.querySelector("#percent")
const fileURLInput = document.querySelector("#fileURL")
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn")

const host = "https://innshare.herokuapp.com"
const newLocal = `${host}api/files`
const uploadURL = newLocal
const emailURl = `${host}api/files/send`

const emailForm = document.querySelector("#emailForm")

const toast = document.querySelector(".toast")

const maxAllowedSize = 1 * 1024 * 1024 * 1024 //1GB

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.add("dragged")) {
        dropZone.classList.add("dragged");
    }
})

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
})
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.table(files);
    if (files.fileLength) {
        fileInput.files = files;
        uploadFile()
    }

});

fileInput.addEventListener("change", () => {
    uploadFile();
})

browseBtn.addEventListener("click", () => {
    fileInput.click()
})

copyBtn.addEventListener("click", () => {
    fileURLInput.select()
    document.execCommand("copy")
    showToast("Coppies to Clipboard")
});

const uploadFile = () => {
    if (fileInput.files.length > 1) {
        resetFileInput();
        showToast("Only upload 1 file!");
        return
    }
    const file = fileInput.files[0];
    if (file.size > maxAllowedSize) {
        showToast("You can't upload more than 1GB of file");
        resetFileInput();
        return;
    }
    progressContainer.style.display = block;
    percentContainer.style.display = block;
    const formData = new formData();
    formData.append("myfile", file);


    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        console.log(xhr.readyState)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response)
            onUploadSuccess(JSON.parse(xhr.response));
        }
    }
    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () => {
        resetFileInput();
        showToast(`Error in upload: ${xhr.statusText}`)
    }

    xhr.open("POST", uploadURL)
    xhr.send(formData);
};

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    // console.log(e)
    bgProgress.style.width = `${percent}%`
    percentDiv.innerText = percent;
}

const onUploadSuccess = ({ file: url }) => {
    console.log(url);
    resetFileInput();
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none"
    percentContainer.style.display = "none"
    sharingContainer.style.display = block
    fileURLInput.value = url;
}

const resteFileImput = () => {
    fileInput.value = "";
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const url = (fileURLInput.value)

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailForm: emailForm.elements["form-email"].value
    }

    emailForm[2].setAttribute("disabled", "true");

    fetch(emailURl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        }).then((res) => res.json())
        .then(({ success }) => {
            if (success) {
                sharingContainer.style.display = "none"
                showToast("E-mail Sent")
            }
        });

});

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)"
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%, 60px)"

    }, 2000)
}