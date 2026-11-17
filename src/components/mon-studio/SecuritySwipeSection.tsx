import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Check,
  Edit3,
  Lock,
  LogOut,
  MessageSquare,
  User,
  KeyRound,
  X
} from 'lucide-react';
import { UserAccount } from '../../types';
import { StageCarousel3D } from '../shared/StageCarousel3D';
import { StageBreadcrumb } from '../shared/StageBreadcrumb';

export type MessagePermissionOption = 'all' | 'invitation' | 'none';

interface SecuritySwipeSectionProps {
  profile: UserAccount;
  onUpdateProfile: (data: Partial<UserAccount>) => void;
  onChangePassword: (newPassword: string) => { success: boolean; message?: string };
  onLogout: () => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

const CARD_META = [
  { id: 'identity', title: 'Identité', icon: User },
  { id: 'account', title: 'Compte', icon: KeyRound },
  { id: 'messaging', title: 'Messagerie', icon: MessageSquare }
] as const;

const MESSAGING_OPTIONS: Array<{
  id: MessagePermissionOption;
  title: string;
  subtitle: string;
}> = [
  {
    id: 'all',
    title: 'Tous les membres',
    subtitle: 'Contacts directs ouverts'
  },
  {
    id: 'invitation',
    title: 'Sur invitation',
    subtitle: 'Motif validé requis'
  },
  {
    id: 'none',
    title: 'Désactivée',
    subtitle: 'Aucun message direct'
  }
];

function compressImageFileToDataUrl(file: File, maxDimension = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture image impossible'));
    reader.onload = () => {
      const rawResult = typeof reader.result === 'string' ? reader.result : '';
      if (!rawResult) {
        reject(new Error('Image vide'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(rawResult);
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width || 1, img.height || 1));
        const targetW = Math.max(1, Math.round((img.width || maxDimension) * scale));
        const targetH = Math.max(1, Math.round((img.height || maxDimension) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawResult);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(rawResult);
        }
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  });
}

export const SecuritySwipeSection: React.FC<SecuritySwipeSectionProps> = ({
  profile,
  onUpdateProfile,
  onChangePassword,
  onLogout,
  onBack,
  onShowToast
}) => {
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isEditingCard, setIsEditingCard] = useState<boolean>(false);

  // Carte 1 : Identité
  const [name, setName] = useState<string>(profile.name || 'Romeo Nonvide');
  const [handle, setHandle] = useState<string>(profile.handle || '@romeo');
  const [city, setCity] = useState<string>(profile.city || profile.territory || 'Cotonou');
  const [country, setCountry] = useState<string>(profile.country || 'Bénin');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    profile.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg'
  );
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Carte 2 : Compte
  const [email, setEmail] = useState<string>(profile.email || 'qoctales@gmail.com');
  const [phone, setPhone] = useState<string>(profile.phone || '');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Carte 3 : Messagerie
  const [messagePermission, setMessagePermission] = useState<MessagePermissionOption>(() => {
    const saved = localStorage.getItem('yonywood_msg_permission');
    if (saved === 'all' || saved === 'invitation' || saved === 'none') return saved;
    return 'all';
  });

  useEffect(() => {
    if (!isEditingCard) {
      setName(profile.name || 'Romeo Nonvide');
      setHandle(profile.handle || '@romeo');
      setCity(profile.city || profile.territory || 'Cotonou');
      setCountry(profile.country || 'Bénin');
      setAvatarUrl(profile.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg');
      setEmail(profile.email || 'qoctales@gmail.com');
      setPhone(profile.phone || '');
    }
  }, [profile, isEditingCard]);

  const resetFormFromProfile = () => {
    setName(profile.name || 'Romeo Nonvide');
    setHandle(profile.handle || '@romeo');
    setCity(profile.city || profile.territory || 'Cotonou');
    setCountry(profile.country || 'Bénin');
    setAvatarUrl(profile.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg');
    setEmail(profile.email || 'qoctales@gmail.com');
    setPhone(profile.phone || '');
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    const savedMsg = localStorage.getItem('yonywood_msg_permission');
    if (savedMsg === 'all' || savedMsg === 'invitation' || savedMsg === 'none') {
      setMessagePermission(savedMsg);
    }
  };

  const goToCard = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= CARD_META.length) return;
    if (isEditingCard) {
      resetFormFromProfile();
      setIsEditingCard(false);
    }
    setCardIndex(targetIndex);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      setAvatarUrl(dataUrl);
    } catch {
      onShowToast("Impossible de lire l'image sélectionnée.");
    }
  };

  const handleValidateActiveCard = () => {
    if (cardIndex === 0) {
      const cleanName = name.trim() || profile.name || 'Romeo Nonvide';
      const cleanHandle = handle.trim() || '@romeo';
      const cleanCity = city.trim();
      const cleanCountry = country.trim();
      onUpdateProfile({
        name: cleanName,
        handle: cleanHandle,
        city: cleanCity,
        territory: cleanCity,
        country: cleanCountry,
        avatarUrl: avatarUrl.trim() || '/assets/images/romeo_avatar_1792698425983.jpg'
      });
      setIsEditingCard(false);
      onShowToast('Identité enregistrée.');
      return;
    }

    if (cardIndex === 1) {
      if (isChangingPassword) {
        if (newPassword.trim().length < 6) {
          setPasswordError('6 caractères minimum.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setPasswordError('Les mots de passe ne correspondent pas.');
          return;
        }
        const res = onChangePassword(newPassword);
        if (!res.success) {
          setPasswordError(res.message || 'Mot de passe invalide.');
          return;
        }
      }

      onUpdateProfile({
        email: email.trim() || profile.email || 'qoctales@gmail.com',
        phone: phone.trim()
      });
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
      setIsEditingCard(false);
      onShowToast('Compte mis à jour.');
      return;
    }

    if (cardIndex === 2) {
      try {
        localStorage.setItem('yonywood_msg_permission', messagePermission);
      } catch {
        // ignore
      }
      setIsEditingCard(false);
      onShowToast('Messagerie enregistrée.');
    }
  };

  const handleCancelEdit = () => {
    resetFormFromProfile();
    setIsEditingCard(false);
  };

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 min-h-0 overflow-hidden flex flex-col justify-between pt-1 sm:pt-2">
        <StageBreadcrumb
          items={[
            { label: 'Profil', onClick: onBack },
            { label: 'Sécurité' }
          ]}
        />

        <StageCarousel3D
          items={[...CARD_META]}
          currentIndex={cardIndex}
          onIndexChange={goToCard}
          getKey={(meta) => meta.id}
          circular={true}
          dragDisabled={isEditingCard}
          showDesktopArrows={true}
          prevAriaLabel="Carte précédente"
          nextAriaLabel="Carte suivante"
          cardClassName={(_meta, _idx, isCenter) => {
            const isThisEditing = isCenter && isEditingCard;
            return `bg-white text-[#1C1917] ${
              isThisEditing
                ? 'border-[#A2482B] ring-1 ring-[#A2482B]/40 shadow-2xl'
                : isCenter
                  ? 'border-stone-200/95 shadow-2xl'
                  : 'border-stone-200/70 shadow-lg cursor-pointer hover:border-stone-300'
            }`;
          }}
          renderCard={(meta, _idx, { isCenter }) => {
            const Icon = meta.icon;
            const isThisCardEditing = isCenter && isEditingCard;

            return (
              <div className="w-full h-full flex flex-col overflow-hidden bg-white">
                {/* En-tête carte + Bouton explicite Modifier / Valider */}
                <div className="shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-stone-100 flex items-center justify-between gap-2 bg-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75]" />
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {meta.title}
                    </h2>
                  </div>

                  {isCenter && (
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {isThisCardEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="w-7 h-7 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 flex items-center justify-center cursor-pointer transition-colors"
                            aria-label="Annuler les modifications"
                            title="Annuler"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleValidateActiveCard}
                            className="px-2.5 py-1 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Check className="w-3 h-3" />
                            <span>Valider</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingCard(true)}
                          className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Contenu scrollable interne de la carte */}
                <div
                  className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3.5 sm:px-4 py-3 space-y-2.5"
                  onMouseDown={(e) => {
                    if (isThisCardEditing) e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    if (isThisCardEditing) e.stopPropagation();
                  }}
                >
                  {/* CARTE 1 : IDENTITÉ */}
                  {meta.id === 'identity' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <img
                            src={avatarUrl}
                            alt={name}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = '/assets/images/romeo_avatar_1792698425983.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            disabled={!isThisCardEditing}
                            onClick={() => photoInputRef.current?.click()}
                            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors ${
                              isThisCardEditing
                                ? 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800 cursor-pointer'
                                : 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                            }`}
                          >
                            <Camera className="w-3 h-3" />
                            <span>Changer la photo</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                          Nom et prénom
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          readOnly={!isThisCardEditing}
                          disabled={!isThisCardEditing}
                          className={`w-full px-2.5 py-1.5 rounded-xl border text-xs sm:text-[13px] transition-colors ${
                            isThisCardEditing
                              ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                              : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                          Identifiant public
                        </label>
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          readOnly={!isThisCardEditing}
                          disabled={!isThisCardEditing}
                          className={`w-full px-2.5 py-1.5 rounded-xl border text-xs sm:text-[13px] font-mono transition-colors ${
                            isThisCardEditing
                              ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                              : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                            Ville
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-2.5 py-1.5 rounded-xl border text-xs sm:text-[13px] transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                            Pays
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-2.5 py-1.5 rounded-xl border text-xs sm:text-[13px] transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARTE 2 : COMPTE */}
                  {meta.id === 'account' && (
                    <div className="min-h-full flex flex-col justify-between gap-3">
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                            Email du compte
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                            Numéro de téléphone
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            placeholder="+229 01 00 00 00 00"
                            onChange={(e) => setPhone(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>

                        <div className="pt-0.5">
                          <div className="flex items-center justify-between mb-0.5 gap-1">
                            <label className="block text-[10px] font-semibold text-stone-500">
                              Mot de passe
                            </label>
                            {isThisCardEditing && !isChangingPassword && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsChangingPassword(true);
                                  setPasswordError(null);
                                }}
                                className="text-[10px] font-semibold text-[#A2482B] hover:underline cursor-pointer"
                              >
                                Modifier
                              </button>
                            )}
                          </div>

                          {!isChangingPassword ? (
                            <div className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200/80 bg-stone-50/70 text-xs text-stone-600 flex items-center justify-between">
                              <span className="tracking-widest">••••••••••</span>
                              <Lock className="w-3 h-3 text-stone-400" />
                            </div>
                          ) : (
                            <div className="space-y-1.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  setPasswordError(null);
                                }}
                                placeholder="Nouveau mot de passe"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B]"
                              />
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  setPasswordError(null);
                                }}
                                placeholder="Confirmer"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B]"
                              />
                              {passwordError && (
                                <p className="text-[10px] text-rose-600 font-medium">{passwordError}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex justify-center">
                        <button
                          type="button"
                          onClick={onLogout}
                          className="text-[11px] font-medium text-stone-400 hover:text-rose-600 inline-flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CARTE 3 : MESSAGERIE */}
                  {meta.id === 'messaging' && (
                    <div className="space-y-2">
                      {MESSAGING_OPTIONS.map((option) => {
                        const isSelected = messagePermission === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            disabled={!isThisCardEditing}
                            onClick={() => {
                              if (!isThisCardEditing) return;
                              setMessagePermission(option.id);
                            }}
                            className={`w-full text-left p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                              isSelected
                                ? 'border-[#A2482B] bg-[#A2482B]/5 ring-1 ring-[#A2482B]'
                                : 'border-stone-200 bg-stone-50/60'
                            } ${isThisCardEditing ? 'cursor-pointer hover:border-stone-300' : 'cursor-default'}`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-900 truncate">
                                {option.title}
                              </p>
                              <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                                {option.subtitle}
                              </p>
                            </div>

                            <div
                              className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'border-[#A2482B] bg-[#A2482B] text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
