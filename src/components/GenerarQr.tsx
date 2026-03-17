import QRCodeStyling from "qr-code-styling";

export async function generarQR(token: string) {

  const qr = new QRCodeStyling({
    width: 290,
    height: 290,
    data: `http://sistemas.imife.gob.mx:8088/ServidoresPublicos/${token}`,
    image: "/SO.png",
    dotsOptions: {
      color: "#000000",
      type: "extra-rounded"
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 2
    }
  });

  return await qr.getRawData("png");
}