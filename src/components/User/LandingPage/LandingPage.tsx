import { Header } from './Header';
import HeroSection from './HeroSection';
import Brand from './Brand';
import Trending from './Trending';
import PartnerBenefitsSection from './PartnerBenefitsSection';
import Footer from '../../Footer/Footer';
import { TopProduct } from './TopProduct';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <HeroSection />
            <Brand id="brands-section" />
            <Trending id="trending-section" />
            <PartnerBenefitsSection id="partner-benefits-section" />
            <TopProduct />
            <Footer />
        </div>
    );
};

export default LandingPage;
