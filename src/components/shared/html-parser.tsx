import React from 'react'
import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';


interface HTMLParserProps {
    html: string;
}

export default function HTMLParser(props: HTMLParserProps) {
    const { html } = props;
    return parse(sanitizeHtml(html));
}

