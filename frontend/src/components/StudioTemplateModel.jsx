import React, { useId } from 'react';

/** Photo based fitting preview: the studio cutout is the canvas and the garment
 * templates are simple, deterministic SVG overlays (no generated images). */
export default function StudioTemplateModel({
  gender = 'Nam', modelImage, topType = 'tshirt_short', topColor = '#24334d',
  topAccent = '#111827', topPattern = 'solid', bottomType = 'jeans_straight',
  bottomColor = '#334155', bottomAccent = '#1e293b', bottomPattern = 'solid'
}) {
  const uid = useId().replace(/:/g, '');
  const female = gender === 'Nữ';
  const shirt = female
    ? 'M 365 360 Q 448 338 531 360 L 548 430 L 565 582 Q 448 606 333 582 L 350 430 Z'
    : 'M 370 254 Q 448 230 526 254 L 546 374 L 558 637 Q 448 666 338 637 L 350 374 Z';
  const tank = female
    ? 'M 380 360 Q 448 338 516 360 L 535 397 L 548 582 Q 448 603 348 582 L 361 397 Z'
    : 'M 390 254 Q 448 230 506 254 L 526 310 L 542 637 Q 448 660 354 637 L 370 310 Z';
  const sleeveShort = female
    ? 'M 319 397 L 348 434 L 365 451 L 347 478 L 333 458 Z M 557 397 L 548 434 L 531 451 L 549 478 L 565 458 Z'
    : 'M 291 290 L 322 397 L 350 374 L 370 344 L 342 321 Z M 605 290 L 574 397 L 546 374 L 526 344 L 554 321 Z';
  const longSleeves = female
    ? 'M 319 397 L 348 434 L 330 555 L 354 562 L 365 451 Z M 557 397 L 548 434 L 566 555 L 542 562 L 531 451 Z'
    : 'M 291 290 L 322 397 L 296 564 L 328 575 L 370 344 Z M 605 290 L 574 397 L 600 564 L 568 575 L 526 344 Z';
  const isLong = ['shirt_long', 'hoodie', 'sweater', 'blazer'].includes(topType);
  const isCrop = topType === 'croptop';
  const topHem = female ? (isCrop ? 520 : 582) : (isCrop ? 555 : 637);
  const bottom = female
    ? 'M 337 584 Q 448 606 559 584 L 574 714 L 548 1045 L 470 1045 L 448 760 L 426 1045 L 348 1045 L 322 714 Z'
    : 'M 338 636 Q 448 664 558 636 L 574 748 L 548 1086 L 470 1086 L 448 794 L 426 1086 L 348 1086 L 322 748 Z';
  const shortBottom = female
    ? 'M 337 584 Q 448 606 559 584 L 564 757 L 472 768 L 448 710 L 426 768 L 332 757 Z'
    : 'M 338 636 Q 448 664 558 636 L 568 806 L 472 820 L 448 754 L 426 820 L 332 806 Z';
  const topPath = topType === 'tanktop' ? tank : isCrop
    ? (female ? 'M 338 360 Q 448 332 557 360 L 576 397 L 548 434 L 565 520 Q 448 540 333 520 L 348 434 L 319 397 Z' : 'M 355 254 Q 448 226 541 254 L 605 290 L 574 397 L 546 374 L 558 555 Q 448 574 338 555 L 350 374 L 322 397 L 291 290 Z')
    : shirt;
  const patternFill = (type, color, accent) => {
    if (type === 'stripes') return `url(#${type}-${uid})`;
    if (type === 'plaid') return `url(#${type}-${uid})`;
    if (type === 'denim') return `url(#${type}-${uid})`;
    return color;
  };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <img src={modelImage} alt="Người mẫu Studio" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
      <svg viewBox="0 0 896 1200" preserveAspectRatio="xMidYMid meet" aria-label="Mẫu thử đồ Studio" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <pattern id={`stripes-${uid}`} width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="34" height="34" fill={topColor}/><rect width="11" height="34" fill={topAccent} opacity=".8"/></pattern>
          <pattern id={`plaid-${uid}`} width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill={topColor}/><path d="M0 0H36M0 18H36M0 0V36M18 0V36" stroke={topAccent} strokeWidth="7" opacity=".6"/></pattern>
          <pattern id={`denim-${uid}`} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><rect width="18" height="18" fill={bottomColor}/><path d="M0 3H18M0 12H18" stroke={bottomAccent} strokeWidth="2" opacity=".42"/></pattern>
        </defs>
        <g style={{ mixBlendMode: 'multiply' }}>
          <path d={bottomType === 'shorts' ? shortBottom : bottom} fill={patternFill(bottomPattern, bottomColor, bottomAccent)} opacity=".93" />
          <path d={bottomType === 'shorts' ? shortBottom : bottom} fill="none" stroke={bottomAccent} strokeWidth="5" opacity=".72" />
          <path d={topPath} fill={patternFill(topPattern, topColor, topAccent)} opacity=".91" />
          {topType === 'tanktop' ? null : <path d={isLong ? longSleeves : sleeveShort} fill={topColor} opacity=".92" />}
          <path d={topPath} fill="none" stroke={topAccent} strokeWidth="4" opacity=".72" />
          {!['tshirt_short', 'tanktop', 'croptop'].includes(topType) && <path d="M448 260 L448 620" stroke={topAccent} strokeWidth="5" opacity=".6"/>}
          {topType === 'polo' && <path d="M419 254 L448 294 L477 254" fill="none" stroke={topAccent} strokeWidth="8"/>}
          {topType === 'hoodie' && <path d="M399 252 Q448 205 497 252 L483 296 L448 278 L413 296 Z" fill={topColor} stroke={topAccent} strokeWidth="4"/>}
          {topType === 'blazer' && <path d="M405 250 L425 315 L448 280 L471 315 L491 250" fill="none" stroke={topAccent} strokeWidth="8"/>}
          {topType === 'shirt_short' && <path d="M405 250 L425 296 L448 278 L471 296 L491 250" fill="none" stroke={topAccent} strokeWidth="7"/>}
          <path d={`M${female ? 340 : 340} ${topHem} Q448 ${topHem + 15} ${female ? 556 : 556} ${topHem}`} fill="none" stroke={topAccent} strokeWidth="4" opacity=".8"/>
          <path d="M448 642 L448 760 M358 685 Q375 840 356 1020 M538 685 Q521 840 540 1020" fill="none" stroke={bottomAccent} strokeWidth="4" opacity=".42"/>
        </g>
      </svg>
    </div>
  );
}
