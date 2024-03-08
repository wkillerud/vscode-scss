// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {indentation, descendant, interpolationEnd, unitToken, identifiers, spaces, comments, indentedMixins} from "./tokens"
import {trackIndent} from "./tokens.js"
import {cssHighlighting} from "./highlight"
const spec_identifier = {__proto__:null,not:62, only:62, using:173, as:183, with:185, without:185, hide:199, show:199, from:222, to:224, if:237, through:243, in:249}
const spec_callee = {__proto__:null,url:80, "url-prefix":80, domain:80, regexp:80, lang:94, "nth-child":94, "nth-last-child":94, "nth-of-type":94, "nth-last-of-type":94, dir:94, "host-context":94, selector:166}
const spec_AtKeyword = {__proto__:null,"@import":150, "@include":170, "@mixin":176, "@function":176, "@use":180, "@extend":188, "@at-root":192, "@forward":196, "@media":202, "@charset":206, "@namespace":210, "@keyframes":216, "@supports":228, "@if":232, "@else":234, "@for":240, "@each":246, "@while":252, "@debug":256, "@warn":256, "@error":256, "@return":256}
export const parser = LRParser.deserialize({
  version: 14,
  states: "I|Q`Q+tOOO#cQ+tOOP#jOpOOO#oQ(pO'#CjOOQ#U'#Ci'#CiO%[Q)QO'#FsO%oQ.jO'#CnO&gQ#dO'#DWO'^Q(pO'#CgO'eQ)OO'#DYO'pQ#dO'#DaO'uQ#dO'#DeOOQ#U'#Fs'#FsO'zQ(pO'#FsO(RQ(nO'#DpO%oQ.jO'#DwO%oQ.jO'#ESO%oQ.jO'#EVO%oQ.jO'#EXO(WQ)OO'#E]O(uQ)OO'#E_O%oQ.jO'#EaO)SQ)OO'#EdO%oQ.jO'#EfO)nQ)OO'#EhO)yQ#dO'#EkO*OQ)OO'#EqO*dQ)OO'#FROOQ&Z'#Fr'#FrOOQ&Y'#FU'#FUO*nQ(nO'#FUQ`Q+tOOO%oQ.jO'#EsO*yQ(nO'#EwO+OQ)OO'#EzO%oQ.jO'#E}O%oQ.jO'#FPOOQ&Z'#F]'#F]O+WQ+uO'#FzO+eQ(oO'#FzQOQ#SOOP+yO#SO'#FqPOOO)CAf)CAfOOQ#U'#Cm'#CmOOQ#U,59W,59WOOQ#i'#Cp'#CpO%oQ.jO'#CsO,XQ.wO'#CuO.tQ.^O,59YO%oQ.jO'#CzOOQ#S'#DO'#DOO/VQ(nO'#DTOOQ#i'#Ft'#FtO/[Q(nO'#C}OOQ#U'#DX'#DXOOQ#U,59r,59rO&gQ#dO,59rO/aQ)OO,59tO'pQ#dO,59{O'uQ#dO,5:PO(WQ)OO,5:TO(WQ)OO,5:VO(WQ)OO,5:WO(WQ)OO'#F[O/lQ(nO,59RO/wQ+tO'#DnO0OQ#TO'#DnOOQ&Z,59R,59ROOQ#U'#D['#D[OOQ#S'#D_'#D_OOQ#U,59t,59tO0TQ(nO,59tO0YQ(nO,59tOOQ#U'#Dc'#DcOOQ#U,59{,59{OOQ#S'#Dg'#DgO0_Q9`O,5:PO0gQ.jO,5:[O0qQ.jO,5:cO1jQ.jO,5:nO1wQ.YO,5:qO2YQ.jO,5:sOOQ#U'#Cj'#CjO3RQ(pO,5:wO3`Q(pO,5:yOOQ&Z,5:y,5:yO3gQ)OO,5:yO3lQ.jO,5:{OOQ#S'#Dz'#DzO4XQ)OO'#EPO4`Q(nO'#F|O*OQ)OO'#EOO4tQ(nO'#EQOOQ#S'#F}'#F}O/oQ(nO,5;OO2`Q.YO,5;QOOQ#d'#Ej'#EjO*nQ(nO,5;SO4yQ)OO,5;SOOQ#S'#Em'#EmO5RQ(nO,5;VO5WQ(nO,5;]O5cQ(nO,5;mOOQ&Z'#F{'#F{OOQ&Y,5;p,5;pOOQ&Y-E9S-E9SO1wQ.YO,5;_O5qQ)OO,5;cO5vQ)OO'#GPO6OQ)OO,5;fO1wQ.YO,5;iO2`Q.YO,5;kOOQ&Z-E9Z-E9ZO6TQ(oO,5<fO6iQ+uO'#F_O6TQ(oO,5<fPOO#S'#FT'#FTP7PO#SO,5<]POOO,5<],5<]O7_Q.YO,59_OOQ#i,59a,59aO%oQ.jO,59cO%oQ.jO,59hO%oQ.jO'#FXO7mQ#WO1G.tOOQ#k1G.t1G.tO7uQ.oO,59fO:_Q! lO,59oO;[Q.jO'#DPOOQ#i,59i,59iOOQ#U1G/^1G/^OOQ#U1G/`1G/`O0TQ(nO1G/`O0YQ(nO1G/`OOQ#U1G/g1G/gO;fQ9`O1G/kO<PQ(pO1G/oO<sQ(pO1G/qO=gQ(pO1G/rO>ZQ(pO,5;vOOQ#S-E9Y-E9YOOQ&Z1G.m1G.mO>hQ(nO,5:YO>mQ+uO,5:YO>tQ)OO'#D`O>{Q.jO'#D^OOQ#U1G/k1G/kO%oQ.jO1G/kO?SQ.kO1G/vOOQ#T1G/v1G/vO*nQ(nO1G/}O@PQ+uO'#F{OOQ&Z1G0Y1G0YO/[Q(nO1G0YOOQ&Z1G0]1G0]OOQ&Z1G0_1G0_O/[Q(nO1G0_O%oQ.jO1G0_OOQ&Z1G0c1G0cOOQ&Z1G0e1G0eOBiQ)OO1G0eOBnQ(nO1G0eOBsQ)OO1G0gOOQ&Z1G0g1G0gOCRQ.jO'#FaOCcQ(nO'#DzOCnQ(nO,5:gOCsQ(nO,5:kO*OQ)OO,5:iOC{Q)OO'#F`OD`Q(nO,5<hODqQ(nO,5:jO(WQ)OO,5:lOOQ&Z1G0j1G0jOOQ&Z1G0l1G0lOOQ&Z1G0n1G0nO*nQ(nO1G0nOEYQ)OO'#EnOOQ&Z1G0q1G0qOOQ&Z1G0w1G0wOOQ&Z1G1X1G1XOEhQ+uO1G0yO%oQ.jO1G0}OHQQ)OO'#FeOH]Q)OO,5<kO%oQ.jO1G1QOOQ&Z1G1T1G1TOOQ&Z1G1V1G1VOHeQ(oO1G2QOHyQ+uO,5;yOOQ#T,5;y,5;yOOQ#T-E9]-E9]POO#S-E9R-E9RPOOO1G1w1G1wOOQ#i1G.y1G.yOIaQ.oO1G.}OOQ#i1G/S1G/SOKyQ.^O,5;sOOQ#W-E9V-E9VOOQ#k7+$`7+$`OL[Q(nO1G/ZOLaQ.jO'#FVOMkQ.jO'#FwO! SQ.jO'#FtO! ZQ(nO,59kOOQ#U7+$z7+$zOOQ#U7+%V7+%VO%oQ.jO7+%VOOQ&Z1G/t1G/tO! `Q#TO1G/tO! eQ(pO'#FyO! oQ(nO,59zO! tQ.jO'#FxO!!OQ(nO,59xO!!TQ.YO7+%VO!!cQ.kO'#F^O%oQ.jO'#F^O!$SQ.kO7+%bOOQ#T7+%b7+%bOOQ&Z7+%i7+%iO5cQ(nO7+%tO*nQ(nO7+%yO!$vQ.jO7+%yO!%QQ(nO7+&PO*OQ)OO7+&POOQ#d-E9_-E9_OOQ&Z7+&R7+&RO!%VQ.jO'#GOOOQ#d,5;{,5;{O%oQ.jO1G0ROOQ#S1G0V1G0VOOQ#S1G0T1G0TO!%qQ(nO,5;zOOQ#S-E9^-E9^O!&VQ(pO1G0WOOQ&Z7+&Y7+&YO!&^Q(vO'#CuO/oQ(nO'#FcO!&iQ)OO,5;YOOQ&Z,5;Y,5;YO!&wQ+uO7+&eO!)aQ)OO7+&eO!)lQ.jO7+&iOOQ#d,5<P,5<POOQ#d-E9c-E9cO1wQ.YO7+&lOOQ#T1G1e1G1eOOQ#i7+$u7+$uOOQ#d-E9T-E9TO!)}Q.jO'#FWO!*[Q(nO,5<cO!*[Q(nO,5<cO%oQ.jO,5<cOOQ#i1G/V1G/VO!*dQ.YO<<HqOOQ&Z7+%`7+%`O!*rQ)OO'#FZO!*|Q(nO,5<eOOQ#U1G/f1G/fO!+UQ.jO'#FYO!+`Q(nO,5<dOOQ#U1G/d1G/dOOQ#U<<Hq<<HqO!+hQ.kO,5;xOOQ#e-E9[-E9[OOQ#T<<H|<<H|OOQ&Z<<I`<<I`OOQ&Z<<Ie<<IeO/[Q(nO<<IeO*OQ)OO<<IkO!-XQ(nO<<IkO!-aQ.jO'#FbO!-tQ)OO,5<jO!.VQ.jO7+%mOOQ#S7+%r7+%rOOQ#d,5;},5;}OOQ#d-E9a-E9aOOQ&Z1G0t1G0tOOQ&Z-E9b-E9bO!)aQ)OO<<JPO%oQ.jO,5<OOOQ&Z<<JP<<JPO%oQ.jO<<JTOOQ&Z<<JW<<JWO!.^Q.jO,5;rO!.kQ.jO,5;rOOQ#S-E9U-E9UO!.rQ(nO1G1}O!.zQ.jO1G1}OOQ#UAN>]AN>]O!/UQ(pO,5;uOOQ#S-E9X-E9XO!/`Q.jO,5;tOOQ#S-E9W-E9WO*nQ(nOAN?PO!/jQ(nOAN?VO/oQ(nOAN?VO!/rQ.jO,5;|OOQ#d-E9`-E9`OOQ#S<<IX<<IXP!0^Q)OO'#FdOOQ&ZAN?kAN?kO1wQ.YO1G1jO1wQ.YOAN?oOOQ#S1G1^1G1^O%oQ.jO1G1^O!0cQ(nO7+'iOOQ&ZG24kG24kO/oQ(nOG24qOOQ&ZG24qG24qOOQ&Z7+'U7+'UOOQ&ZG25ZG25ZO!0kQ.jO7+&xOOQ&ZLD*]LD*]",
  stateData: "!0{~O$cOSVOSUOS$aQQ~OS^OTUOWaOX`O[[O_TOc^OtXO}XO!UYO!YZO!lkO!m_O!w`O!zaO!|bO#QcO#SdO#UeO#XfO#ZgO#]hO#`iO#fjO#hpO#lqO#orO#rsO#ttO$_RO$jVO~O$Y$nP~P`O$ayO~Ot^Xt!eXv^X}^X!U^X!Y^X!^^X!a^X!c^X$]^X$`^X$j^X~Ot$gXv$gX}$gX!U$gX!Y$gX!^$gX!a$gX!c$gX$]$gX$`$gX$j$gX~O$_{O!i$gX$b$gXf$gXe$gX~P$gOS!UOTUO_!UOc!UOf!OOh!UOj!UOo!ROx!TO$^!SO$_}O$i!PO~O$_!WO~Ot!ZO}!ZO!U![O!Y!]O!^!^O!a!`O!c!cO$]!_O$`!dO$j!YO~Ov!aO~P&lO!P!jO$^!gO$_!fO~O$_!kO~O$_!mO~Ot!oO~P$gOt!oO~OTUO[[O_TOtXO}XO!UYO!YZO$_!tO$jVO~Of!xO!c!cO$`!dO~P(WOTUOc#POf!{Oo!}O!u#OO$_!zO!c$pP$`$pP~Oj#TOx!TO$_#SO~O$_#VO~OTUOc#POf!{Oo!}O!u#OO$_!zO~O!i$pP$b$pP~P)SO!i#ZO$`#ZO$b#ZO~Oc#_O~Oc#`O#p$sP~O$Y$nX!j$nX$[$nX~P`O!i#ZO$`#ZO$b#ZO$Y$nX!j$nX$[$nX~OU#hOV#hO$`#jO$c#hO~OR#lOPiXQiXliXmiX$jiXTiXciXfiXoiX!iiX!uiX$_iX$`iX$biX!ciX!xiX!}iX#OiX#ViXeiXSiX_iXhiXjiXviXxiX!fiX!giX!hiX$^iX$iiX$YiXuiX!WiX#diX#miX!jiX$[iX~OP#qOQ#oOl#mOm#mO$j#nO~Of#sO~Of#tO~O!P#yO$^!gO$_!fO~Ov!aO!c!cO$`!dO~O!j$nP~P`O$Z$TO~Of$UO~Of$VO~O!W$WO![$XO~O!c!cO$`!dO~P%oOl#mOm#mO$j#nO!i$pP$`$pP$b$pP~P*OOl#mOm#mO!i#ZO$b#ZO$j#nO~O!c!cO!x$_O$`$]O~P1XOl#mOm#mO!c!cO$`!dO$j#nO~O!}$cO#O$bO$`#ZO~P1XOt!ZO}!ZO!U![O!Y!]O!^!^O!a!`O$]!_O$j!YO~O!i#ZO$`#ZO$b#ZO~P2gOf$fO~P&lO#O$gO~O#V$jO$`#ZO~P1XOTUOc#POf!{Oo!}O!u#OO~O$_$kO~P3vOm$nOv$oO!c$pX$`$pX!i$pX$b$pX~Of$rO~Oj$vOx!TO~O!c$wO~Om$nO!c!cO$`!dO~O!c!cO!i#ZO$`$]O$b#ZO~O#c$|O~Ov$}O#p$sX~O#p%PO~O!i#ZO$`#ZO$b#ZO$Y$na!j$na$[$na~O!i$RX$Y$RX$`$RX$b$RX!j$RX$[$RX~P`OU#hOV#hO$`%XO$c#hO~Oe%YOl#mOm#mO$j#nO~OP%_OQ#oO~Ol#mOm#mO$j#nOPnaQnaTnacnafnaona!ina!una$_na$`na$bna!cna!xna!}na#Ona#VnaenaSna_nahnajnavnaxna!fna!gna!hna$^na$ina$Ynauna!Wna#dna#mna!jna$[na~Oj%`Oy%`O~OS!UOTUO_!UOf!OOh!UOj!UOo!ROx!TO$^!SO$_}O$i!PO~Oc%cOe$kP~P:gO!W%fO![%gO~Ot!ZO}!ZO!U![O!Y!]O$j!YO~Ov!]i!^!]i!a!]i!c!]i$]!]i$`!]i!i!]i$b!]if!]ie!]i~P;nOv!_i!^!_i!a!_i!c!_i$]!_i$`!_i!i!_i$b!_if!_ie!_i~P;nOv!`i!^!`i!a!`i!c!`i$]!`i$`!`i!i!`i$b!`if!`ie!`i~P;nOv$Oa!c$Oa$`$Oa~P2gO!j%hO~O$[$nP~P`Oe$mP~P(WOe$lP~P%oOl#mOm#mOv%pO!f%rO!g%rO!h%rO$j#nO!i!di$`!di$b!di$Y!di!j!di$[!di~P%oO$Z$TOS$oXT$oXW$oXX$oX[$oX_$oXc$oXt$oX}$oX!U$oX!Y$oX!l$oX!m$oX!w$oX!z$oX!|$oX#Q$oX#S$oX#U$oX#X$oX#Z$oX#]$oX#`$oX#f$oX#h$oX#l$oX#o$oX#r$oX#t$oX$Y$oX$_$oX$j$oX!j$oX!i$oX$`$oX$b$oX$[$oX~O#O%wO~Ot%xO~O!i#ZO#V$jO$`#ZO$b#ZO~O!i$rP#V$rP$`$rP$b$rP~P%oOe!nXm!nXt!pX~Ot%}O~Oe&OOm$nO~Ov$SX!c$SX$`$SX!i$SX$b$SX~P*OOv$oO!c$pa$`$pa!i$pa$b$pa~Om$nOv!ra!c!ra$`!ra!i!ra$b!rae!ra~O!j&XO#c&VO#d&VO$i&UO~O#i&ZOS#giT#giW#giX#gi[#gi_#gic#git#gi}#gi!U#gi!Y#gi!l#gi!m#gi!w#gi!z#gi!|#gi#Q#gi#S#gi#U#gi#X#gi#Z#gi#]#gi#`#gi#f#gi#h#gi#l#gi#o#gi#r#gi#t#gi$Y#gi$_#gi$j#gi!j#gi!i#gi$`#gi$b#gi$[#gi~Oc&]Ov$XX#p$XX~Ov$}O#p$sa~O!i#ZO$`#ZO$b#ZO$Y$ni!j$ni$[$ni~O!i$Ra$Y$Ra$`$Ra$b$Ra!j$Ra$[$Ra~P`O$j#nOPkiQkilkimkiTkickifkioki!iki!uki$_ki$`ki$bki!cki!xki!}ki#Oki#VkiekiSki_kihkijkivkixki!fki!gki!hki$^ki$iki$Ykiuki!Wki#dki#mki!jki$[ki~Ol#mOm#mO$j#nOP#{aQ#{a~Oe&aO~Ol#mOm#mO$j#nOS#yXT#yX_#yXc#yXe#yXf#yXh#yXj#yXo#yXu#yXv#yXx#yX$^#yX$_#yX$i#yX~Ou&eOv&cOe$kX~P%oOS$hXT$hX_$hXc$hXe$hXf$hXh$hXj$hXl$hXm$hXo$hXu$hXv$hXx$hX$^$hX$_$hX$i$hX$j$hX~Ot&fO~PMxOe&gO~O$[&iO~Ov&jOe$mX~P2gOe&lO~Ov&mOe$lX~P%oOe&oO~Ol#mOm#mO!W&pO$j#nO~Ol#mOm#mO$j#nOS$QXT$QX_$QXc$QXf$QXh$QXj$QXo$QXv$QXx$QX!f$QX!g$QX!h$QX!i$QX$^$QX$_$QX$`$QX$b$QX$i$QX$Y$QX!j$QX$[$QX~Ov%pO!f&sO!g&sO!h&sO!i!dq$`!dq$b!dq$Y!dq!j!dq$[!dq~P%oO#O&vO$`#ZO~P1XOt&wO~Ol#mOm#mOv&yO$j#nO!i$rX#V$rX$`$rX$b$rX~Om$nOv$Sa!c$Sa$`$Sa!i$Sa$b$Sa~Oe&|O~P2gOR#lO!ciX$`iX~O!j'PO#c&VO#d&VO$i&UO~O#i'ROS#gqT#gqW#gqX#gq[#gq_#gqc#gqt#gq}#gq!U#gq!Y#gq!l#gq!m#gq!w#gq!z#gq!|#gq#Q#gq#S#gq#U#gq#X#gq#Z#gq#]#gq#`#gq#f#gq#h#gq#l#gq#o#gq#r#gq#t#gq$Y#gq$_#gq$j#gq!j#gq!i#gq$`#gq$b#gq$[#gq~O!c!cO#j'SO$`!dO~Ol#mOm#mO#d'UO#m'UO$j#nO~Oc'XOe#zXv#zX~P:gOv&cOe$ka~Ol#mOm#mO!W']O$j#nO~Oe#}Xv#}X~P(WOv&jOe$ma~Oe#|Xv#|X~P%oOv&mOe$la~Ol#mOm#mO$j#nOS$QaT$Qa_$Qac$Qaf$Qah$Qaj$Qao$Qav$Qax$Qa!f$Qa!g$Qa!h$Qa!i$Qa$^$Qa$_$Qa$`$Qa$b$Qa$i$Qa$Y$Qa!j$Qa$[$Qa~Oe'dOm$nO~Ov$UX!i$UX#V$UX$`$UX$b$UX~P%oOv&yO!i$ra#V$ra$`$ra$b$ra~Oe'gO~P%oOu'lOe#zav#za~P%oOt'mO~PMxOv&cOe$ki~Ov&cOe$ki~P%oOe#}av#}a~P2gOe#|av#|a~P%oOe'pOm$nO~Ol#mOm#mO$j#nOv$Ua!i$Ua#V$Ua$`$Ua$b$Ua~O#j'SO~Ov&cOe$kq~Oe#zqv#zq~P%oO$i$jl!al~",
  goto: "7w$tPPPPPPPPPPP$uP%P%dP%P%w%zP'kPP'kP(iP'kPP'kP'k'k)k*iPPP*uPP%P+y%PP,PP,V,],c%PP,iP%PP,oP%PP%P%PP,uP.W.jPPPPP$uPP'_'_.t'_'_'_'_P$uPP$uP$uPPP$uP$uP$uPP$uP$uP$uP.w$uP.z.}PP$uP$uPPP$uPP$uPP$uP$uP$uP/Q/W/^/|0[0b0h0n0t1Q1W1b1h1n1t1z2QPPPPPPPPPPP2W2Z2g3^PP5d5g5j5m5v6|7V7q7talOPov!c#f$T%Ts[OPcdov!^!_!`!a!c#f$T$U$r%T&jsSOPcdov!^!_!`!a!c#f$T$U$r%T&jR|Tb[cd!^!_!`!a$U$r&j`]OPov!c#f$T%T!v!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$c$j$|%P%b%g%l%p%q%}&c&f&m&y&{'S'U'W'['`'m'te#Pfjk!p!{!}$n$o%x&w!w!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$c$j$|%P%b%g%l%p%q%}&c&f&m&y&{'S'U'W'['`'m't!v!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$c$j$|%P%b%g%l%p%q%}&c&f&m&y&{'S'U'W'['`'m'tT&V$w&W!w!VU_`abegpst!O!R!o#m#n#o#t$V$X$Y$c$j$|%P%b%g%l%p%q%}&c&f&m&y&{'S'U'W'['`'m'tQ#u!VQ%t$_Q%u$bR'b&v!v!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$c$j$|%P%b%g%l%p%q%}&c&f&m&y&{'S'U'W'['`'m'tQ#ThR$v#UQ!XVR#v!YQ!hXR#w!ZQ#w!jR%e#yQ!iXR#x!ZQ#w!iR%e#xQ!lYR#z![Q!nZR#{!]Q!eWQ!wdQ$R!bQ$Z!oQ$^!qQ$`!rQ$e!vQ$s#QQ$y#XQ$z#YQ${#^Q%Q#bQ&t%tQ&}&VQ'T&ZQ'V&_Q'i'RQ'q'dQ'r'jQ's'kR'u'pSnOoUwP!c$TQ#evQ%U#fR&`%Ta^OPov!c#f$T%TR$l!{R#UhR#WiR$x#WQ#iyR%W#iQoOR#]oQ%b#tQ%l$V^&b%b%l&{'W'['`'tQ&{%}Q'W&cQ'[&fQ'`&mR't'mQ&d%bU'Y&d'Z'nQ'Z&eR'n'[Q#p!QR%^#pQ&n%lR'a&nQ&k%jR'_&kQ!bWR$Q!bUvP!c$TS#dv%TR%T#fQ%q$YR&r%qQ#gwQ%S#eT%V#g%SQ$p!|R&R$pQ$h!yR%y$hQ&z%{R'f&zQ&W$wR'O&WQ&Y${R'Q&YQ%O#`R&^%ORzQSmOo]uPv!c#f$T%T`WOPov!c#f$T%TQ!ucQ!vdQ#|!^Q#}!_Q$O!`Q$P!aQ%j$UQ&S$rR'^&jQ!QUQ!p_Q!q`Q!raQ!sbQ!yeQ#RgQ#^pQ#bsQ#ctQ#k!OQ#r!RQ$Y!oQ%Z#mQ%[#nQ%]#ol%a#t$V%b%l%}&c&f&m&{'W'['`'m'tQ%n$XS%o$Y%qQ%v$cQ%{$jQ&[$|Q&_%PQ&h%gQ&q%pQ'e&yQ'j'SR'k'UR%d#tR%m$VR%k$UQxPQ$S!cR%i$TQ#[nW#fw#e#g%SQ$^!qQ$a!sQ$d!uQ$i!yQ$t#RQ$u#TQ$z#YQ%R#cQ%s$[Q%z$hQ&T$vQ&t%tS&u%u%vR'o'bQ#QfQ#YkR$[!pU!|fk!pQ#XjQ$m!{Q$q!}Q&P$nQ&Q$oQ&x%xR'c&wR%|$jR#ar",
  nodeNames: "⚠ InterpolationEnd InterpolationContinue Unit VariableName InterpolationStart LineComment Comment IndentedMixin IndentedInclude StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector SuffixedSelector Suffix Interpolation SassVariableName ValueName ) ( ParenthesizedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp LogicOp UnaryExpression LogicOp NamespacedValue CallExpression Callee ArgList : ... , CallLiteral CallTag ParenthesizedContent ClassSelector ClassName PseudoClassSelector :: PseudoClassName PseudoClassName ArgList PseudoClassName ArgList IdSelector # IdName ] AttributeSelector [ AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block { Declaration PropertyName Important Global Default ; } ImportStatement AtKeyword import KeywordQuery FeatureQuery FeatureName BinaryQuery UnaryQuery ParenthesizedQuery SelectorQuery selector IncludeStatement include Keyword MixinStatement mixin UseStatement use Keyword Keyword ExtendStatement extend RootStatement at-root ForwardStatement forward Keyword MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList Keyword Keyword SupportsStatement supports IfStatement ControlKeyword ControlKeyword Keyword ForStatement ControlKeyword Keyword EachStatement ControlKeyword Keyword WhileStatement ControlKeyword OutputStatement ControlKeyword AtRule Styles",
  maxTerm: 173,
  context: trackIndent,
  nodeProps: [
    ["openedBy", 1,"InterpolationStart",5,"InterpolationEnd",21,"(",72,"{"],
    ["isolate", -3,6,7,26,""],
    ["closedBy", 22,")",65,"}"]
  ],
  propSources: [cssHighlighting],
  skippedNodes: [0,6,7,131],
  repeatNodeCount: 17,
  tokenData: "!!]~RyOq#rqr$jrs0jst2^tu8{uv;hvw;ywx<[xy=yyz>[z{>a{|>z|}Cm}!ODO!O!PDm!P!Q;h!Q![FW![!]GR!]!^G}!^!_H`!_!`Hw!`!aI`!a!b#r!b!cJa!c!}#r!}#OKy#O#P#r#P#QL[#Q#RLm#R#T#r#T#UMS#U#c#r#c#dNe#d#o#r#o#pNz#p#qLm#q#r! ]#r#s! n#s;'S#r;'S;=`!!V<%lO#rW#uSOy$Rz;'S$R;'S;=`$d<%lO$RW$WSyWOy$Rz;'S$R;'S;=`$d<%lO$RW$gP;=`<%l$RY$m[Oy$Rz!_$R!_!`%c!`#W$R#W#X%v#X#Z$R#Z#[)Z#[#]$R#]#^,V#^;'S$R;'S;=`$d<%lO$RY%jSyWlQOy$Rz;'S$R;'S;=`$d<%lO$RY%{UyWOy$Rz#X$R#X#Y&_#Y;'S$R;'S;=`$d<%lO$RY&dUyWOy$Rz#Y$R#Y#Z&v#Z;'S$R;'S;=`$d<%lO$RY&{UyWOy$Rz#T$R#T#U'_#U;'S$R;'S;=`$d<%lO$RY'dUyWOy$Rz#i$R#i#j'v#j;'S$R;'S;=`$d<%lO$RY'{UyWOy$Rz#`$R#`#a(_#a;'S$R;'S;=`$d<%lO$RY(dUyWOy$Rz#h$R#h#i(v#i;'S$R;'S;=`$d<%lO$RY(}S!hQyWOy$Rz;'S$R;'S;=`$d<%lO$RY)`UyWOy$Rz#`$R#`#a)r#a;'S$R;'S;=`$d<%lO$RY)wUyWOy$Rz#c$R#c#d*Z#d;'S$R;'S;=`$d<%lO$RY*`UyWOy$Rz#U$R#U#V*r#V;'S$R;'S;=`$d<%lO$RY*wUyWOy$Rz#T$R#T#U+Z#U;'S$R;'S;=`$d<%lO$RY+`UyWOy$Rz#`$R#`#a+r#a;'S$R;'S;=`$d<%lO$RY+yS!gQyWOy$Rz;'S$R;'S;=`$d<%lO$RY,[UyWOy$Rz#a$R#a#b,n#b;'S$R;'S;=`$d<%lO$RY,sUyWOy$Rz#d$R#d#e-V#e;'S$R;'S;=`$d<%lO$RY-[UyWOy$Rz#c$R#c#d-n#d;'S$R;'S;=`$d<%lO$RY-sUyWOy$Rz#f$R#f#g.V#g;'S$R;'S;=`$d<%lO$RY.[UyWOy$Rz#h$R#h#i.n#i;'S$R;'S;=`$d<%lO$RY.sUyWOy$Rz#T$R#T#U/V#U;'S$R;'S;=`$d<%lO$RY/[UyWOy$Rz#b$R#b#c/n#c;'S$R;'S;=`$d<%lO$RY/sUyWOy$Rz#h$R#h#i0V#i;'S$R;'S;=`$d<%lO$RY0^S!fQyWOy$Rz;'S$R;'S;=`$d<%lO$R~0mWOY0jZr0jrs1Vs#O0j#O#P1[#P;'S0j;'S;=`2W<%lO0j~1[Oj~~1_RO;'S0j;'S;=`1h;=`O0j~1kXOY0jZr0jrs1Vs#O0j#O#P1[#P;'S0j;'S;=`2W;=`<%l0j<%lO0j~2ZP;=`<%l0jZ2cY!UPOy$Rz!Q$R!Q![3R![!c$R!c!i3R!i#T$R#T#Z3R#Z;'S$R;'S;=`$d<%lO$RY3WYyWOy$Rz!Q$R!Q![3v![!c$R!c!i3v!i#T$R#T#Z3v#Z;'S$R;'S;=`$d<%lO$RY3{YyWOy$Rz!Q$R!Q![4k![!c$R!c!i4k!i#T$R#T#Z4k#Z;'S$R;'S;=`$d<%lO$RY4rYhQyWOy$Rz!Q$R!Q![5b![!c$R!c!i5b!i#T$R#T#Z5b#Z;'S$R;'S;=`$d<%lO$RY5iYhQyWOy$Rz!Q$R!Q![6X![!c$R!c!i6X!i#T$R#T#Z6X#Z;'S$R;'S;=`$d<%lO$RY6^YyWOy$Rz!Q$R!Q![6|![!c$R!c!i6|!i#T$R#T#Z6|#Z;'S$R;'S;=`$d<%lO$RY7TYhQyWOy$Rz!Q$R!Q![7s![!c$R!c!i7s!i#T$R#T#Z7s#Z;'S$R;'S;=`$d<%lO$RY7xYyWOy$Rz!Q$R!Q![8h![!c$R!c!i8h!i#T$R#T#Z8h#Z;'S$R;'S;=`$d<%lO$RY8oShQyWOy$Rz;'S$R;'S;=`$d<%lO$R_9O`Oy$Rz}$R}!O:Q!O!Q$R!Q![:Q![!_$R!_!`;T!`!c$R!c!}:Q!}#R$R#R#S:Q#S#T$R#T#o:Q#o;'S$R;'S;=`$d<%lO$RZ:X^yWcROy$Rz}$R}!O:Q!O!Q$R!Q![:Q![!c$R!c!}:Q!}#R$R#R#S:Q#S#T$R#T#o:Q#o;'S$R;'S;=`$d<%lO$R[;[S![SyWOy$Rz;'S$R;'S;=`$d<%lO$RY;mSlQOy$Rz;'S$R;'S;=`$d<%lO$RZ<OS_ROy$Rz;'S$R;'S;=`$d<%lO$R~<_WOY<[Zw<[wx1Vx#O<[#O#P<w#P;'S<[;'S;=`=s<%lO<[~<zRO;'S<[;'S;=`=T;=`O<[~=WXOY<[Zw<[wx1Vx#O<[#O#P<w#P;'S<[;'S;=`=s;=`<%l<[<%lO<[~=vP;=`<%l<[Z>OSfROy$Rz;'S$R;'S;=`$d<%lO$R~>aOe~_>hU[PlQOy$Rz!_$R!_!`;T!`;'S$R;'S;=`$d<%lO$RZ?RWlQ!aPOy$Rz!O$R!O!P?k!P!Q$R!Q![Bp![;'S$R;'S;=`$d<%lO$RZ?pUyWOy$Rz!Q$R!Q![@S![;'S$R;'S;=`$d<%lO$RZ@ZYyW$iROy$Rz!Q$R!Q![@S![!g$R!g!h@y!h#X$R#X#Y@y#Y;'S$R;'S;=`$d<%lO$RZAOYyWOy$Rz{$R{|An|}$R}!OAn!O!Q$R!Q![BV![;'S$R;'S;=`$d<%lO$RZAsUyWOy$Rz!Q$R!Q![BV![;'S$R;'S;=`$d<%lO$RZB^UyW$iROy$Rz!Q$R!Q![BV![;'S$R;'S;=`$d<%lO$RZBw[yW$iROy$Rz!O$R!O!P@S!P!Q$R!Q![Bp![!g$R!g!h@y!h#X$R#X#Y@y#Y;'S$R;'S;=`$d<%lO$RZCrSvROy$Rz;'S$R;'S;=`$d<%lO$RZDTWlQOy$Rz!O$R!O!P?k!P!Q$R!Q![Bp![;'S$R;'S;=`$d<%lO$RZDrW$jROy$Rz!O$R!O!PE[!P!Q$R!Q![@S![;'S$R;'S;=`$d<%lO$RYEaUyWOy$Rz!O$R!O!PEs!P;'S$R;'S;=`$d<%lO$RYEzSuQyWOy$Rz;'S$R;'S;=`$d<%lO$RZF][$iROy$Rz!O$R!O!P@S!P!Q$R!Q![Bp![!g$R!g!h@y!h#X$R#X#Y@y#Y;'S$R;'S;=`$d<%lO$RZGWUtROy$Rz![$R![!]Gj!];'S$R;'S;=`$d<%lO$RXGqS}PyWOy$Rz;'S$R;'S;=`$d<%lO$RZHSS!iROy$Rz;'S$R;'S;=`$d<%lO$RYHeUlQOy$Rz!_$R!_!`%c!`;'S$R;'S;=`$d<%lO$R^H|U![SOy$Rz!_$R!_!`%c!`;'S$R;'S;=`$d<%lO$RZIgV!^PlQOy$Rz!_$R!_!`%c!`!aI|!a;'S$R;'S;=`$d<%lO$RXJTS!^PyWOy$Rz;'S$R;'S;=`$d<%lO$RXJdWOy$Rz!c$R!c!}J|!}#T$R#T#oJ|#o;'S$R;'S;=`$d<%lO$RXKT[!lPyWOy$Rz}$R}!OJ|!O!Q$R!Q![J|![!c$R!c!}J|!}#T$R#T#oJ|#o;'S$R;'S;=`$d<%lO$RXLOS!YPOy$Rz;'S$R;'S;=`$d<%lO$R^LaS!WUOy$Rz;'S$R;'S;=`$d<%lO$R[LpUOy$Rz!_$R!_!`;T!`;'S$R;'S;=`$d<%lO$RZMVUOy$Rz#b$R#b#cMi#c;'S$R;'S;=`$d<%lO$RZMnUyWOy$Rz#W$R#W#XNQ#X;'S$R;'S;=`$d<%lO$RZNXSmRyWOy$Rz;'S$R;'S;=`$d<%lO$RZNhUOy$Rz#f$R#f#gNQ#g;'S$R;'S;=`$d<%lO$RZ! PS!cROy$Rz;'S$R;'S;=`$d<%lO$RZ! bS!jROy$Rz;'S$R;'S;=`$d<%lO$R]! sU!aPOy$Rz!_$R!_!`;T!`;'S$R;'S;=`$d<%lO$RW!!YP;=`<%l#r",
  tokenizers: [indentation, descendant, interpolationEnd, unitToken, identifiers, spaces, comments, indentedMixins, 0, 1, 2, 3],
  topRules: {"StyleSheet":[0,10],"Styles":[1,130]},
  dialects: {indented: 0},
  specialized: [{term: 153, get: (value) => spec_identifier[value] || -1},{term: 152, get: (value) => spec_callee[value] || -1},{term: 74, get: (value) => spec_AtKeyword[value] || -1}],
  tokenPrec: 2843
})
