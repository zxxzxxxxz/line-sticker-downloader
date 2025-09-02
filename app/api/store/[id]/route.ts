import { NextRequest, NextResponse } from "next/server";
import { parse } from 'node-html-parser';

export async function getStickerUrls(storeId: string) {
    const res = await fetch(`https://store.line.me/stickershop/product/${storeId}/ja`);
    const root = parse(await res.text());
    const dataPreviews = root.querySelectorAll('.FnStickerList>li').map(li => {
        const dataPreview = JSON.parse(li.attrs['data-preview']) as {
            type: string,
            id: string,
            staticUrl: string
        };
        return dataPreview;
    });

    return dataPreviews.map(d => {
        return {
            id: d.id,
            url: d.staticUrl
        };
    });
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const json = await getStickerUrls(params.id);
    return NextResponse.json(json);
}

export const POST = GET;