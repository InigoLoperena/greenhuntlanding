const DeckPage = () => {
  return (
    <div className="w-screen h-screen">
      <object
        data="/deck.pdf"
        type="application/pdf"
        className="w-full h-full"
      >
        <p className="p-8 text-center text-white bg-black min-h-screen flex flex-col items-center justify-center gap-4">
          <span className="text-xl">Tu navegador no puede mostrar el PDF.</span>
          <a
            href="/deck.pdf"
            download
            className="text-green-400 underline hover:text-green-300"
          >
            Descargar PDF
          </a>
        </p>
      </object>
    </div>
  );
};

export default DeckPage;
