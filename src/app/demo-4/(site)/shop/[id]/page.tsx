import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail4 } from "@/components/demo4/shop/ProductDetail4";
import { getProduct4, products4 } from "@/components/demo4/products4";

export function generateStaticParams() {
  return products4.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/demo-4/shop/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const p = getProduct4(id);
  if (!p) return {};
  return { title: `${p.name} ${p.brand}`, description: p.description, alternates: { canonical: `/demo-4/shop/${p.id}` } };
}

export default async function Demo4Product(props: PageProps<"/demo-4/shop/[id]">) {
  const { id } = await props.params;
  if (!getProduct4(id)) notFound();
  return <ProductDetail4 id={id} />;
}
