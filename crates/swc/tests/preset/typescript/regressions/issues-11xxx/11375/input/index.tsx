export default function DropdownNavbarItemDesktop({
    items,
    ...props
  }) {
    return (
      <div>
        <NavbarNavLink
          onClick={props.to ? undefined : (e) => e.preventDefault()}
        >
          {props.children ?? props.label}
        </NavbarNavLink>
      </div>
    );
  }