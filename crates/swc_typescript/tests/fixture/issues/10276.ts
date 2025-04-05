export const Tabs = {
    Name: "name",
} as const;

export interface BandMember {
    name: string;
}

const MemberTabs = {
    Name: Tabs.Name,
};

type MemberTab = keyof typeof MemberTabs;

export const MemberTab: () => BandMember = () => {
    return { name: "Mark" };
};
