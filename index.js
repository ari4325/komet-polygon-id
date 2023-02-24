
var qrcode_img = document.getElementById('qrcode_img');
var qr = new QRCode(qrcode_img);

let account, provider;
window.addEventListener("load", async() => {
    if(window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.send("eth_requestAccounts");
        if (accounts.result.length) {
            const account = accounts.result[0];
        }
    }else{
        alert("Metamask Not Installed");
    }
});

const generateQr = async(object) => {
    qr.makeCode(object);
}

let wallect_connect, address;
wallect_connect = document.getElementById('wallet_connect');
wallect_connect.addEventListener("click", async() => {

    const message = "Komet <> Polygon";

    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    const signerAddr = await ethers.utils.verifyMessage(message, signature);
    console.log(signerAddr);

    if(address === signerAddr) {
        fetch("https://self-hosted-platform.polygonid.me/v1/did:polygonid:polygon:mumbai:2qKFVHfLtxsCxDPpJyAmhk6Vt4reEjJrMMMZBMB5Qz/claims", {
            method: "POST",
            body: JSON.stringify({
                "credentialSchema":"https://raw.githubusercontent.com/ari4325/polygon-id-schemas-komet/main/schemas/proof-of-valuation.json",
                "type": "ProofOfValuation",
                "credentialSubject": {
                    "id": "did:polygonid:polygon:mumbai:2qDkpMUCR98CVmKzrdpPqenZjLQeHnxWy3ZmximvN5",
                    "value": 100
                },
                "expiration": 12345
            }),
            headers: {
                "Authorization": "Basic dXNlcjpwYXNzd29yZA==",
                "Content-Type": "application/json"
            },
        }).then(console.log);
    }
})
