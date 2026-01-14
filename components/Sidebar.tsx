'use client';

const foundations = [
  { id: 'color', label: '色彩 Color' },
  { id: 'typography', label: '文本 Typography' },
  { id: 'spacing', label: '间距 Spacing' },
  { id: 'layout', label: '布局 Layout' },
  { id: 'radius', label: '圆角 Radius' },
  { id: 'elevation', label: '阴影与层级 Elevation' },
  { id: 'iconography', label: '图标 Iconography' }
];

const componentsNav = [
  { id: 'button', label: '按钮 Button' },
  { id: 'tabs', label: '选项卡 Tabs' },
  { id: 'badge', label: '徽章 Badge' }
];

export default function Sidebar({
  active,
  onSelect,
  mobileOpen
}: {
  active: string;
  onSelect: (id: string) => void;
  mobileOpen: boolean;
}) {
  const LinkItem = ({ id, label }: { id: string; label: string }) => (
    <li>
      <a
        className={active === id ? 'nav-link active' : 'nav-link'}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          onSelect(id);
        }}
        href={`#${id}`}
      >
        {label}
      </a>
    </li>
  );

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar__section">
        <div className="sidebar__title">Design Foundations</div>
        <ul>{foundations.map(i => <LinkItem key={i.id} {...i} />)}</ul>
      </div>
      <div className="sidebar__section">
        <div className="sidebar__title">Components</div>
        <ul>{componentsNav.map(i => <LinkItem key={i.id} {...i} />)}</ul>
      </div>
    </aside>
  );
}
