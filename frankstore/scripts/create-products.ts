import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function uploadToCloudinary(filePath: string): Promise<string> {
  const resolved = path.resolve(__dirname, "..", filePath);
  console.log(`Subiendo ${resolved} a Cloudinary...`);

  const result = await cloudinary.uploader.upload(resolved, {
    folder: "frankstore/products",
    resource_type: "image",
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  console.log(`✅ URL: ${result.secure_url}`);
  return result.secure_url;
}

async function getExistingImage(slug: string): Promise<string | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { image: true },
  });
  return product?.image ?? null;
}

async function uploadOrReuse(slug: string, filePath: string): Promise<string> {
  const existing = await getExistingImage(slug);
  if (existing) {
    console.log(`⏭️  Ya existe imagen para ${slug}, reutilizando URL`);
    return existing;
  }
  return await uploadToCloudinary(filePath);
}

async function main() {
  const imageUrlCuchillos = await uploadOrReuse("kit-de-cuchillos-cocina-negros", "public/images/kit de cuchillos cocina negros.jpeg");
  const imageUrlZapatillasBlancas = await uploadOrReuse("zapatillas-blancas-aero", "public/images/zapatillas blancas aero.jpeg");
  const imageUrlDron = await uploadOrReuse("dron-naranja-profesional", "public/images/dron naranja profesional.jpeg");
  const imageUrlBuzoNegro = await uploadOrReuse("buzo-negro", "public/images/buzo neegro.jpeg");
  const imageUrlBuzoNegro2 = await uploadOrReuse("buzo-negro-2", "public/images/buzo negro 2.jpeg");
  const imageUrlBuzoPoleron = await uploadOrReuse("buzo-poleron-negro-modelo-3", "public/images/buzo poleron negro modelo 3.jpeg");
  const imageUrlMultiherramientas = await uploadOrReuse("kit-multiherramientas", "public/images/herramientas kit multiherramientas.jpeg");
  const imageUrlTaladro = await uploadOrReuse("taladro-verde-calidad", "public/images/taladro verde calidad.jpeg");

  const products = [
    {
      name: "Kit de Cuchillos Cocina Negros",
      slug: "kit-de-cuchillos-cocina-negros",
      description:
        "Kit completo de cuchillos de cocina con acabado negro mate. Incluye cuchillo chef, cuchillo santoku, cuchillo pan y cuchillo para verduras. Hojas de acero inoxidable carbonado, mango antideslizante, estuche de almacenamiento incluido.",
      price: 95000,
      image: imageUrlCuchillos,
      images: [imageUrlCuchillos],
      categoryId: "cat_mas-vendidos",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Zapatillas Blancas Aero",
      slug: "zapatillas-blancas-aero",
      description:
        "Zapatillas deportivas Aero en color blanco. Diseño aerodinámico, upper de malla ultraligera, suela de espuma EVA con amortiguación responsive. Ideales para running y uso diario con máximo confort.",
      price: 165000,
      image: imageUrlZapatillasBlancas,
      images: [imageUrlZapatillasBlancas],
      categoryId: "cat_mas-vendidos",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Dron Naranja Profesional",
      slug: "dron-naranja-profesional",
      description:
        "Dron profesional color naranja con cámara 4K a 60fps, estabilización de 3 ejes, GPS/GLONASS doble, vuelo autonomy de 35 minutos. Incluye control remoto con pantalla, 4 hélices extra y maletín de transporte.",
      price: 850000,
      image: imageUrlDron,
      images: [imageUrlDron],
      categoryId: "cat_imperdibles",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Buzo Negro",
      slug: "buzo-negro",
      description:
        "Buzo negro de algodón premium 350gsm. Corte regular, capucha forrada, bolsillo canguro, cierre metálico de alta calidad. Ideal para el día a día con estilo urbano.",
      price: 89000,
      image: imageUrlBuzoNegro,
      images: [imageUrlBuzoNegro],
      categoryId: "cat_ropa",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Buzo Negro 2",
      slug: "buzo-negro-2",
      description:
        "Buzo negro segunda edición con diseño actualizado. Algodón franela cepillado, corte oversize, costuras reforzadas, cuello redondo. Comodidad y durabilidad en una prenda esencial.",
      price: 95000,
      image: imageUrlBuzoNegro2,
      images: [imageUrlBuzoNegro2],
      categoryId: "cat_ropa",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Buzo Poleron Negro Modelo 3",
      slug: "buzo-poleron-negro-modelo-3",
      description:
        "Poleron negro tercera generación. Tejido de punto grueso, cierre frontal completo, cuello alto, puños elásticos. Diseño minimalista versátil para combinar con cualquier outfit.",
      price: 110000,
      image: imageUrlBuzoPoleron,
      images: [imageUrlBuzoPoleron],
      categoryId: "cat_ropa",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Kit Multiherramientas",
      slug: "kit-multiherramientas",
      description:
        "Kit completo de multiherramientas con 15 funciones: alicates, cuchillo, sierra, destornillador, cortaúñas, abrelatas y más. Acero inoxidable, funda de cuero incluida. Imprescindible para cualquier emergencia.",
      price: 75000,
      image: imageUrlMultiherramientas,
      images: [imageUrlMultiherramientas],
      categoryId: "cat_imperdibles",
      featured: false,
      bestSeller: false,
    },
    {
      name: "Taladro Verde Calidad",
      slug: "taladro-verde-calidad",
      description:
        "Taladro eléctrico verde de alta potencia. Motor de 800W, 2 velocidades, mandril autoblocante de 13mm, 25+1 niveles de torque. Incluye 2 baterías recargables y maletín de transporte.",
      price: 220000,
      image: imageUrlTaladro,
      images: [imageUrlTaladro],
      categoryId: "cat_destacada",
      featured: false,
      bestSeller: false,
    },
  ];

  for (const product of products) {
    const result = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.log(`✅ Producto creado/actualizado: ${result.name} (${result.id})`);
  }

  console.log("\n🎉 8 productos creados/actualizados correctamente con imágenes en Cloudinary.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
