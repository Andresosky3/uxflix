#!/usr/bin/env python3
"""Rebuild the local episode handouts: python scripts/build-pdfs.py.

Authoring requirement: Python 3 and reportlab (pip install reportlab).
The website serves the generated PDFs directly and needs no Python packages.
"""

import argparse
import json
import re
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
PAGE_WIDTH, PAGE_HEIGHT = A4
NAVY = colors.HexColor('#101827')
INK = colors.HexColor('#172440')
MUTED = colors.HexColor('#52617b')


def read_js_array(path, variable):
    """Read the JSON array assigned to an existing browser data variable."""
    source = path.read_text(encoding='utf-8-sig')
    match = re.search(r'window\.' + re.escape(variable) + r'\s*=\s*', source)
    if not match:
        raise ValueError(f'{variable} was not found in {path.name}')
    value, _ = json.JSONDecoder().raw_decode(source[match.end():])
    return value


def text(value):
    # Preserve accents, normalize invisible characters and use simple hyphens.
    return escape(str(value).replace('\u200b', '').replace('\u2011', '-')
                  .replace('\u2013', '-').replace('\u2014', '-'))


def paragraph(value, style):
    return Paragraph(text(value).replace('\n', '<br/>'), style)


def register_fonts():
    for name, file in [('Inter', 'Inter-400.ttf'), ('InterBold', 'Inter-700.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(ROOT / 'assets' / file)))
    pdfmetrics.registerFontFamily('Inter', normal='Inter', bold='InterBold')


def styles():
    return {
        'label': ParagraphStyle(
            'Section label', fontName='InterBold', fontSize=8.5,
            leading=11, textColor=MUTED, spaceAfter=8, keepWithNext=True,
        ),
        'body': ParagraphStyle(
            'Body', fontName='Inter', fontSize=10.2, leading=15.3,
            textColor=INK, spaceAfter=5, alignment=TA_LEFT,
        ),
        'bullet': ParagraphStyle(
            'Bullet', fontName='Inter', fontSize=10.1, leading=15,
            textColor=INK, leftIndent=13, firstLineIndent=-10, spaceAfter=4,
        ),
        'policy': ParagraphStyle(
            'Policy', fontName='Inter', fontSize=10.1, leading=15.1,
            textColor=INK, spaceAfter=0,
        ),
        'policy_code': ParagraphStyle(
            'Policy code', fontName='InterBold', fontSize=8.3, leading=15.1,
            textColor=colors.HexColor('#5429af'), spaceAfter=0,
        ),
        'advice': ParagraphStyle(
            'Advice', fontName='Inter', fontSize=10.1, leading=15,
            textColor=INK, spaceAfter=0,
        ),
        'advice_label': ParagraphStyle(
            'Advice label', fontName='InterBold', fontSize=8.3,
            leading=11, textColor=colors.HexColor('#5429af'), spaceAfter=7,
        ),
    }


def section(title, values, style, bullets=False):
    items = [paragraph(title.upper(), style['label'])]
    if bullets:
        items.extend(paragraph('-  ' + value, style['bullet']) for value in values)
    else:
        items.append(paragraph(values, style['body']))
    items.append(Spacer(1, 14))
    return KeepTogether(items)


def policy_table(policies, style, width):
    """Keep each policy's code and exact wording together when pages split."""
    rows = [[paragraph(p['code'], style['policy_code']),
             paragraph(p['text'], style['policy'])] for p in policies]
    table = Table(rows, colWidths=[57, width - 57], hAlign='LEFT', splitByRow=1)
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (0, -1), 9),
        ('RIGHTPADDING', (1, 0), (1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e9f0')),
    ]))
    return table


def build_episode(episode, season, destination):
    accent = colors.HexColor(season['color'])
    font_styles = styles()
    margin = 44
    content_width = PAGE_WIDTH - 2 * margin

    def decorate(canvas, doc):
        canvas.saveState()
        first_page = doc.page == 1
        header_height = 186 if first_page else 90
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_HEIGHT - header_height, PAGE_WIDTH, header_height,
                    stroke=0, fill=1)
        canvas.setFillColor(accent)
        canvas.rect(0, PAGE_HEIGHT - header_height - 5, PAGE_WIDTH, 5,
                    stroke=0, fill=1)
        canvas.setFillColor(colors.white)
        canvas.setFont('InterBold', 20)
        canvas.drawString(margin, PAGE_HEIGHT - 42, 'UXFLIX')
        canvas.setFont('Inter', 8)
        canvas.setFillColor(colors.HexColor('#b5c5e0'))
        canvas.drawRightString(PAGE_WIDTH - margin, PAGE_HEIGHT - 36,
                               'GUÍA DEL EPISODIO' if first_page else 'CONTINUACIÓN')
        canvas.setFont('InterBold', 8.5)
        canvas.drawString(margin, PAGE_HEIGHT - 66,
                          f"TEMPORADA {season['id']:02d}  /  EPISODIO {episode['id']:02d}")
        if first_page:
            title_style = ParagraphStyle(
                'Title', fontName='InterBold', fontSize=20, leading=24,
                textColor=colors.white,
            )
            title = paragraph(episode['title'], title_style)
            _, height = title.wrap(content_width, 60)
            title.drawOn(canvas, margin, PAGE_HEIGHT - 78 - height)
            step_style = ParagraphStyle(
                'Methodology step', fontName='Inter', fontSize=9, leading=13,
                textColor=colors.HexColor('#b5c5e0'),
            )
            step = paragraph(episode['step'], step_style)
            _, step_height = step.wrap(content_width, 30)
            step.drawOn(canvas, margin, PAGE_HEIGHT - 138 - step_height)
            phase = season.get('methodology', season['phase'])
            duration = episode.get('duration') or (
                'Ejecución y validación de la solución' if season['id'] == 5
                else season['duration']
            )
            meta = paragraph(f"FASE {season['id']:02d} · {phase} · {duration}",
                             step_style)
            _, meta_height = meta.wrap(content_width, 28)
            meta.drawOn(canvas, margin, PAGE_HEIGHT - 163 - meta_height)
        canvas.setStrokeColor(colors.HexColor('#dfe5ee'))
        canvas.line(margin, 42, PAGE_WIDTH - margin, 42)
        canvas.setFont('Inter', 7.2)
        canvas.setFillColor(MUTED)
        canvas.drawString(margin, 28, f"UXFLIX  /  {season['title']}")
        canvas.drawRightString(PAGE_WIDTH - margin, 28, f'{doc.page}')
        canvas.restoreState()

    doc = BaseDocTemplate(
        str(destination), pagesize=A4,
        title=f"UXFLIX - Episodio {episode['id']:02d}: {episode['title']}",
        author='UXFLIX', subject=episode['step'],
        leftMargin=margin, rightMargin=margin, topMargin=216, bottomMargin=59,
    )
    doc.addPageTemplates([
        PageTemplate(
            id='episode', onPage=decorate, autoNextPageTemplate='continuation',
            frames=[Frame(margin, 59, content_width, PAGE_HEIGHT - 275,
                          leftPadding=0, rightPadding=0, topPadding=0,
                          bottomPadding=0)],
        ),
        PageTemplate(
            id='continuation', onPage=decorate,
            frames=[Frame(margin, 59, content_width, PAGE_HEIGHT - 180,
                          leftPadding=0, rightPadding=0, topPadding=0,
                          bottomPadding=0)],
        ),
    ])
    story = [
        section('Objetivo del episodio', episode['objective'], font_styles),
        paragraph('POLÍTICAS', font_styles['label']),
        policy_table(episode['policies'], font_styles, content_width),
        Spacer(1, 18),
        section('Entregables', episode['deliverables'], font_styles, bullets=True),
    ]
    advice = [
        paragraph('CONSEJO DE WIRI', font_styles['advice_label']),
        paragraph(episode['tip'], font_styles['advice']),
    ]
    advice_box = Table([[advice]], colWidths=[content_width])
    advice_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f2edfb')),
        ('BOX', (0, 0), (-1, -1), 0.6, colors.HexColor('#e1d4f5')),
        ('LEFTPADDING', (0, 0), (-1, -1), 16),
        ('RIGHTPADDING', (0, 0), (-1, -1), 16),
        ('TOPPADDING', (0, 0), (-1, -1), 13),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
    ]))
    story.append(KeepTogether([advice_box]))
    doc.build(story)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=ROOT / 'assets' / 'pdf')
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    register_fonts()
    episodes = read_js_array(ROOT / 'content.js', 'UXFLIX_CONTENT')
    seasons = {s['id']: s for s in read_js_array(ROOT / 'metadata.js', 'UXFLIX_SEASONS')}
    for episode in episodes:
        destination = args.output_dir / f"uxflix-episodio-{episode['id']:02d}.pdf"
        build_episode(episode, seasons[episode['season']], destination)
        print(destination.relative_to(ROOT) if destination.is_relative_to(ROOT) else destination)


if __name__ == '__main__':
    main()
