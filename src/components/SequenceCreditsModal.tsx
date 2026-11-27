import React from 'react';
import { Clapperboard, X, Film, Video, Scissors, ArrowRight, User } from 'lucide-react';
import { SequenceCredits } from '../types';

interface SequenceCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  seriesTitle?: string;
  credits?: SequenceCredits;
  onNavigateToProfile: (protagonistId: string) => void;
}

export const SequenceCreditsModal: React.FC<SequenceCreditsModalProps> = ({
  isOpen,
  onClose,
  title,
  seriesTitle,
  credits,
  onNavigateToProfile
}) => {
  if (!isOpen) return null;

  // Default fallback credits if none specifically passed
  const activeCredits: SequenceCredits = credits || {
    casting: [
      {
        name: 'Témoin intervenant',
        roleOrCharacter: 'Témoignage en miroir 9:16',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    director: {
      name: 'Alain Kpatoukpa',
      roleTitle: 'Réalisateur & Directeur de la photographie',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    postProduction: [
      {
        name: 'Sonia Dossou',
        role: 'Montage & Rythme narratif',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Mathieu Houndé',
        role: 'Mixage sonore & Étalonnage cinématographique',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
      }
    ]
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121F4B]/85 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#1F44A8] text-white rounded-3xl border border-white/25 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête sobre et cinématographique */}
        <div className="flex items-center justify-between p-5 border-b border-white/15 bg-[#121F4B]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#A2482B]/25 border border-[#A2482B]/50 flex items-center justify-center text-[#FFE7A3]">
              <Clapperboard className="w-4 h-4 text-[#A2482B]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                Générique & Crédits de la séquence
              </span>
              <h3 className="font-editorial text-lg font-bold text-white line-clamp-1">
                {title}
              </h3>
              {seriesTitle && (
                <p className="text-xs text-[#FFE7A3] font-medium">
                  {seriesTitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1F44A8] hover:bg-[#A2482B] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="Fermer le générique"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps des crédits */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* 1. CASTING */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFE7A3]">
              <User className="w-3.5 h-3.5 text-[#A2482B]" />
              <span>Casting & Témoins à l'écran</span>
            </div>

            <div className="space-y-2">
              {activeCredits.casting.map((member, idx) => {
                const isClickable = !!member.protagonistId;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (member.protagonistId) {
                        onClose();
                        onNavigateToProfile(member.protagonistId);
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      isClickable
                        ? 'bg-[#121F4B]/65 hover:bg-[#121F4B]/90 border-white/20 hover:border-[#A2482B] cursor-pointer group'
                        : 'bg-[#121F4B]/45 border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/25"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <h4 className={`text-sm font-semibold transition-colors ${
                          isClickable ? 'text-white group-hover:text-[#FFE7A3]' : 'text-white'
                        }`}>
                          {member.name}
                        </h4>
                        <p className="text-xs text-white/75">
                          {member.roleOrCharacter}
                        </p>
                      </div>
                    </div>

                    {isClickable && (
                      <span className="text-xs text-white/80 group-hover:text-white flex items-center gap-1">
                        <span className="text-[11px] hidden sm:inline">Voir profil</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. RÉALISATION */}
          <div className="space-y-3 pt-2 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFE7A3]">
              <Film className="w-3.5 h-3.5 text-[#A2482B]" />
              <span>Réalisation & Prise de vue</span>
            </div>

            <div
              onClick={() => {
                if (activeCredits.director.protagonistId) {
                  onClose();
                  onNavigateToProfile(activeCredits.director.protagonistId);
                }
              }}
              className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                activeCredits.director.protagonistId
                  ? 'bg-[#121F4B]/65 hover:bg-[#121F4B]/90 border-white/20 hover:border-[#FFE7A3]/60 cursor-pointer group'
                  : 'bg-[#121F4B]/45 border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={activeCredits.director.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                  alt={activeCredits.director.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/25"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className={`text-sm font-semibold transition-colors ${
                    activeCredits.director.protagonistId ? 'text-white group-hover:text-[#FFE7A3]' : 'text-white'
                  }`}>
                    {activeCredits.director.name}
                  </h4>
                  <p className="text-xs text-white/75">
                    {activeCredits.director.roleTitle || 'Réalisateur & Cadreur documentaire'}
                  </p>
                </div>
              </div>

              {activeCredits.director.protagonistId && (
                <span className="text-xs text-white/80 group-hover:text-white flex items-center gap-1">
                  <span className="text-[11px] hidden sm:inline">Voir profil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>

          {/* 3. POST-PRODUCTION */}
          <div className="space-y-3 pt-2 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
              <Scissors className="w-3.5 h-3.5 text-[#A2482B]" />
              <span>Post-Production & Traitement sonore</span>
            </div>

            <div className="space-y-2">
              {activeCredits.postProduction.map((item, idx) => {
                const isClickable = !!item.protagonistId;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.protagonistId) {
                        onClose();
                        onNavigateToProfile(item.protagonistId);
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      isClickable
                        ? 'bg-[#121F4B]/65 hover:bg-[#121F4B]/90 border-white/20 hover:border-white/40 cursor-pointer group'
                        : 'bg-[#121F4B]/45 border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatarUrl || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/25"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <h4 className={`text-sm font-semibold transition-colors ${
                          isClickable ? 'text-white group-hover:text-[#FFE7A3]' : 'text-white'
                        }`}>
                          {item.name}
                        </h4>
                        <p className="text-xs text-white/75">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    {isClickable && (
                      <span className="text-xs text-white/80 group-hover:text-white flex items-center gap-1">
                        <span className="text-[11px] hidden sm:inline">Voir profil</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pied de modale sobre */}
        <div className="p-4 border-t border-white/15 bg-[#121F4B]/55 flex items-center justify-between text-xs text-white/75">
          <span>GBADOO • Droits & filiation certifiés</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white font-medium transition-colors cursor-pointer"
          >
            Reprendre le visionnage
          </button>
        </div>
      </div>
    </div>
  );
};
