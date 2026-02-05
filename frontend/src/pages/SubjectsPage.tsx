import SubjectsSection from "@/components/SubjectsSection";

const SubjectsPage = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 pt-20">
                {/* Reuse the rewritten SubjectsSection which is already perfect */}
                <SubjectsSection />
            </main>
        </div>
    );
};

export default SubjectsPage;
